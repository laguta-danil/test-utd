import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from '../products/products.module';
import { ImportController } from './import.controller';
import { ImportProcessor } from './import.processor';
import { ImportService } from './import.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'product-import',
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    ProductsModule, // Import ProductsModule to use ProductsService
    ConfigModule,
  ],
  controllers: [ImportController],
  providers: [ImportService, ImportProcessor],
})
export class ImportModule {}
