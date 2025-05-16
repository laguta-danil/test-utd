import { ApiProperty } from '@nestjs/swagger';

export interface ImportProduct {
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

export interface DummyJsonResponse {
  products: ImportProduct[];
  total: number;
  skip: number;
  limit: number;
}

export class ImportResponseDto {
  @ApiProperty({ description: 'Import job ID' })
  jobId: string;

  @ApiProperty({ description: 'Import status' })
  status: string;

  @ApiProperty({ description: 'Import start time' })
  startedAt: Date;

  @ApiProperty({ description: 'Total number of items to import' })
  totalItems: number;

  @ApiProperty({ description: 'Number of items to skip' })
  skip: number;

  @ApiProperty({ description: 'Number of items to limit' })
  limit: number;

  @ApiProperty({ description: 'Items data from external API', type: 'array' })
  items: ImportProduct[];
}

export class ImportStatusDto {
  @ApiProperty({ description: 'Import job ID' })
  jobId: string;

  @ApiProperty({ description: 'Current status of the import' })
  status: string;

  @ApiProperty({ description: 'Progress percentage' })
  progress: number;

  @ApiProperty({ description: 'Number of processed items' })
  processedItems: number;

  @ApiProperty({ description: 'Number of total items' })
  totalItems: number;

  @ApiProperty({ description: 'Number of deleted items' })
  deletedItems: number;

  @ApiProperty({ description: 'Import start time' })
  startedAt: Date;

  @ApiProperty({ description: 'Import finish time', required: false })
  finishedAt?: Date;

  @ApiProperty({ description: 'Error message if any', required: false })
  error?: string;
}
