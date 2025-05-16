import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  Min,
  IsUrl,
  IsNotEmpty,
  IsObject,
  ValidateNested,
  IsEmail,
  IsDate,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

@Entity('products')
export class Product {
  @ApiProperty({ description: 'Unique identifier' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'External API product ID' })
  @Column({ unique: true })
  externalId: number;

  @ApiProperty({ description: 'Product title' })
  @Column()
  title: string;

  @ApiProperty({ description: 'Product description' })
  @Column('text')
  description: string;

  @ApiProperty({ description: 'Product price' })
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ApiProperty({ description: 'Discount percentage' })
  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  discountPercentage: number;

  @ApiProperty({ description: 'Product rating' })
  @Column('decimal', { precision: 3, scale: 2 })
  rating: number;

  @ApiProperty({ description: 'Product stock' })
  @Column()
  stock: number;

  @ApiProperty({ description: 'Product brand' })
  @Column()
  brand: string;

  @ApiProperty({ description: 'Product category' })
  @Column()
  category: string;

  @ApiProperty({ description: 'Product tags' })
  @Column('simple-array')
  tags: string[];

  @ApiProperty({ description: 'Product SKU' })
  @Column()
  sku: string;

  @ApiProperty({ description: 'Product weight' })
  @Column('decimal', { precision: 10, scale: 2 })
  weight: number;

  @ApiProperty({ description: 'Product dimensions' })
  @Column('jsonb')
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };

  @ApiProperty({ description: 'Warranty information' })
  @Column()
  warrantyInformation: string;

  @ApiProperty({ description: 'Shipping information' })
  @Column()
  shippingInformation: string;

  @ApiProperty({ description: 'Availability status' })
  @Column()
  availabilityStatus: string;

  @ApiProperty({ description: 'Product reviews' })
  @Column('jsonb')
  reviews: Array<{
    rating: number;
    comment: string;
    date: Date;
    reviewerName: string;
    reviewerEmail: string;
  }>;

  @ApiProperty({ description: 'Return policy' })
  @Column()
  returnPolicy: string;

  @ApiProperty({ description: 'Minimum order quantity' })
  @Column()
  minimumOrderQuantity: number;

  @ApiProperty({ description: 'Product metadata' })
  @Column('jsonb')
  meta: {
    createdAt: Date;
    updatedAt: Date;
    barcode: string;
    qrCode: string;
  };

  @ApiProperty({ description: 'Product thumbnail URL' })
  @Column()
  thumbnail: string;

  @ApiProperty({ description: 'Product images' })
  @Column('text', { array: true })
  images: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Nested DTOs for complex objects
export class DimensionsDto {
  @ApiProperty({ description: 'Product width' })
  @IsNumber()
  @Min(0)
  width: number;

  @ApiProperty({ description: 'Product height' })
  @IsNumber()
  @Min(0)
  height: number;

  @ApiProperty({ description: 'Product depth' })
  @IsNumber()
  @Min(0)
  depth: number;
}

export class ReviewDto {
  @ApiProperty({ description: 'Review rating' })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: 'Review comment' })
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiProperty({ description: 'Review date' })
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty({ description: 'Reviewer name' })
  @IsString()
  @IsNotEmpty()
  reviewerName: string;

  @ApiProperty({ description: 'Reviewer email' })
  @IsEmail()
  reviewerEmail: string;
}

export class ProductMetaDto {
  @ApiProperty({ description: 'Creation date' })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;

  @ApiProperty({ description: 'Product barcode' })
  @IsString()
  @IsNotEmpty()
  barcode: string;

  @ApiProperty({ description: 'Product QR code' })
  @IsString()
  qrCode: string;
}

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

  @ApiProperty({ description: 'Product tags', type: [String] })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({ description: 'Product SKU' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ description: 'Product weight' })
  @IsNumber()
  @Min(0)
  weight: number;

  @ApiProperty({ description: 'Product dimensions' })
  @IsObject()
  @ValidateNested()
  @Type(() => DimensionsDto)
  dimensions: DimensionsDto;

  @ApiProperty({ description: 'Warranty information' })
  @IsString()
  warrantyInformation: string;

  @ApiProperty({ description: 'Shipping information' })
  @IsString()
  shippingInformation: string;

  @ApiProperty({ description: 'Availability status' })
  @IsString()
  availabilityStatus: string;

  @ApiProperty({ description: 'Product reviews', type: [ReviewDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReviewDto)
  reviews: ReviewDto[];

  @ApiProperty({ description: 'Return policy' })
  @IsString()
  returnPolicy: string;

  @ApiProperty({ description: 'Minimum order quantity' })
  @IsNumber()
  @Min(1)
  minimumOrderQuantity: number;

  @ApiProperty({ description: 'Product metadata' })
  @IsObject()
  @ValidateNested()
  @Type(() => ProductMetaDto)
  meta: ProductMetaDto;

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
    description: 'Filter by category',
    required: false,
    example: 'electronics',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    description: 'Filter by brand',
    required: false,
    example: 'Apple',
  })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiProperty({
    description: 'Filter by price range (min)',
    required: false,
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiProperty({
    description: 'Filter by price range (max)',
    required: false,
    example: 1000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;

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
