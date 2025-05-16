import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ProductsService } from '../products/products.service';
import { AppException } from '../../common/exceptions/app.exception';
import { ConfigService } from '@nestjs/config';
import { Configuration } from 'src/config/configuration';

interface ImportProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  category?: string;
  thumbnail?: string;
  images: string[];
}

interface DummyJsonResponse {
  products: ImportProduct[];
  total: number;
  skip: number;
  limit: number;
}

@Processor('product-import')
export class ImportProcessor {
  private readonly logger = new Logger(ImportProcessor.name);
  private readonly apiUrl: string;

  constructor(
    private readonly productsService: ProductsService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<Configuration>,
  ) {
    const apiUrl = this.configService.get<string>('externalApiUrl');
    if (!apiUrl) {
      throw new Error('externalApiUrl is not configured');
    }
    this.apiUrl = apiUrl;
  }

  private handleError(error: unknown, context: string): never {
    if (error instanceof Error) {
      throw new AppException(error.message, context, error.stack);
    }
    throw new AppException('Unknown error', context);
  }

  @Process('import-products')
  async handleImport(job: Job) {
    try {
      this.logger.log(`Starting import process for job ${job.id}`);

      // Get data from API
      const { data } = await firstValueFrom(
        this.httpService.get<DummyJsonResponse>(this.apiUrl),
      );
      const products = data.products;

      // Get all existing externalId from database
      const existingExternalIds =
        await this.productsService.getAllExternalIds();

      // Get all externalId from API
      const apiExternalIds = products.map((product) => product.id);

      // Find product IDs that don't exist in API
      const idsToDelete = existingExternalIds.filter(
        (id) => !apiExternalIds.includes(id),
      );

      // Delete products that don't exist in API
      for (const externalId of idsToDelete) {
        try {
          const product =
            await this.productsService.findByExternalId(externalId);
          if (product) {
            await this.productsService.remove(product.id);
            this.logger.log(`Deleted product with external ID ${externalId}`);
          }
        } catch (error: unknown) {
          this.handleError(
            error,
            `Error deleting product with external ID ${externalId}`,
          );
        }
      }

      let processedItems = 0;
      const totalItems = products.length;

      // Update or create products
      for (const product of products) {
        try {
          const existingProduct = await this.productsService.findByExternalId(
            product.id,
          );

          const updatedFields = {
            externalId: product.id,
            title: product.title,
            description: product.description,
            price: product.price,
            discountPercentage: product.discountPercentage,
            rating: product.rating,
            stock: product.stock,
            brand: product.brand || '',
            category: product.category || '',
            thumbnail: product.thumbnail || '',
            images: product.images,
          };

          if (existingProduct) {
            const isChanged = Object.keys(updatedFields).some((key) => {
              if (Array.isArray(updatedFields[key])) {
                return (
                  JSON.stringify(existingProduct[key]) !==
                  JSON.stringify(updatedFields[key])
                );
              }
              // For numeric fields stored as strings (decimal)
              if (['price', 'discountPercentage', 'rating'].includes(key)) {
                return (
                  Number(existingProduct[key]) !== Number(updatedFields[key])
                );
              }
              return existingProduct[key] !== updatedFields[key];
            });

            if (isChanged) {
              await this.productsService.update(
                existingProduct.id,
                updatedFields,
              );
            }
          } else {
            await this.productsService.create(updatedFields);
          }

          processedItems++;
          await job.progress(Math.floor((processedItems / totalItems) * 100));
        } catch (error: unknown) {
          this.handleError(error, `Error processing product ${product.id}`);
        }
      }

      this.logger.log(`Import process completed for job ${job.id}`);
      return {
        processedItems,
        totalItems,
        deletedItems: idsToDelete.length,
      };
    } catch (error: unknown) {
      this.handleError(error, `Import process failed for job ${job.id}`);
    }
  }
}
