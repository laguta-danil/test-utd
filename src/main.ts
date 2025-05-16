import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('UTD eCommerce API')
    .setDescription('API documentation for UTD eCommerce application')
    .setVersion('1.0')
    .addTag('products', 'Product management endpoints')
    .addTag('import', 'Data import endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Get DataSource from DI container
  const dataSource = app.get(DataSource);
  await dataSource.runMigrations();

  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(process.env.PORT || 3000);
}
void bootstrap();
