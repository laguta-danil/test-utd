import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  Min,
  IsUrl,
  IsNotEmpty,
  IsDate,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ description: 'External API product ID' })
  @IsNumber()
  @IsNotEmpty()
  externalId: number;

  @ApiProperty({ description: 'Product title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Product description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Product price' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Discount percentage' })
  @IsNumber()
  @Min(0)
  discountPercentage: number;

  @ApiProperty({ description: 'Product rating' })
  @IsNumber()
  @Min(0)
  rating: number;

  @ApiProperty({ description: 'Product stock' })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ description: 'Product brand' })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({ description: 'Product category' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ description: 'Product thumbnail URL' })
  @IsString()
  @IsUrl()
  thumbnail: string;

  @ApiProperty({ description: 'Product images', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsUrl({}, { each: true })
  images: string[];
}

export class UpdateProductDto extends CreateProductDto {}

export class ProductQueryDto {
  @ApiProperty({
    description: 'Search query for product title',
    required: false,
    example: 'iPhone',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Page number',
    required: false,
    default: 1,
    minimum: 1,
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    required: false,
    default: 10,
    minimum: 1,
    maximum: 100,
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}

export class ProductResponseDto {
  @ApiProperty({ description: 'Product data' })
  data: CreateProductDto;

  @ApiProperty({ description: 'Success message' })
  message: string;
}

export class ProductsListResponseDto {
  @ApiProperty({ description: 'List of products', type: [CreateProductDto] })
  data: CreateProductDto[];

  @ApiProperty({
    description: 'Pagination metadata',
    example: {
      total: 100,
      page: 1,
      limit: 10,
      totalPages: 10,
    },
  })
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 404,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Product not found',
  })
  message: string;

  @ApiProperty({
    description: 'Detailed error information',
    required: false,
    example: 'Product with ID 123 was not found in the database',
  })
  error?: string;
}

export class ImportResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the import job',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  jobId: string;

  @ApiProperty({
    description: 'Current status of the import job',
    enum: ['started', 'processing', 'completed', 'failed'],
    example: 'started',
  })
  @IsString()
  status: string;

  @ApiProperty({
    description: 'Timestamp when the import job was started',
    example: '2024-03-20T10:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  startedAt: Date;
}

export class ImportStatusDto {
  @ApiProperty({
    description: 'Unique identifier of the import job',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  jobId: string;

  @ApiProperty({
    description: 'Current status of the import job',
    enum: ['started', 'processing', 'completed', 'failed'],
    example: 'processing',
  })
  @IsString()
  status: string;

  @ApiProperty({
    description: 'Progress percentage of the import job',
    minimum: 0,
    maximum: 100,
    example: 45,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  progress: number;

  @ApiProperty({
    description: 'Number of items processed so far',
    example: 45,
  })
  @IsNumber()
  @Min(0)
  processedItems: number;

  @ApiProperty({
    description: 'Total number of items to process',
    example: 100,
  })
  @IsNumber()
  @Min(0)
  totalItems: number;

  @ApiProperty({
    description: 'Timestamp when the import job was started',
    example: '2024-03-20T10:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  startedAt: Date;

  @ApiProperty({
    description: 'Timestamp when the import job was completed',
    required: false,
    example: '2024-03-20T10:05:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  finishedAt?: Date;

  @ApiProperty({
    description: 'Error message if the import job failed',
    required: false,
    example: 'Failed to fetch products from external API',
  })
  @IsOptional()
  @IsString()
  error?: string;
}

export class ImportErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 500,
  })
  @IsNumber()
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Import job failed',
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Detailed error information',
    required: false,
    example: 'Failed to connect to external API: timeout after 5000ms',
  })
  @IsOptional()
  @IsString()
  error?: string;

  @ApiProperty({
    description: 'Import job ID if available',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsString()
  jobId?: string;
}

export class ImportQueryDto {
  @ApiProperty({
    description: 'Filter imports by status',
    required: false,
    enum: ['started', 'processing', 'completed', 'failed'],
    example: 'processing',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    description: 'Page number',
    required: false,
    default: 1,
    minimum: 1,
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    required: false,
    default: 10,
    minimum: 1,
    maximum: 100,
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}
