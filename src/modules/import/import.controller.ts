import { Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ImportResponseDto, ImportStatusDto } from './dto/import.dto';
import { ImportService } from './import.service';

@ApiTags('import')
@Controller('import')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post()
  @ApiOperation({ summary: 'Start product import process' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Import process started successfully',
    type: ImportResponseDto,
  })
  async startImport(): Promise<ImportResponseDto> {
    return this.importService.startImport();
  }

  @Get('status/:jobId')
  @ApiOperation({ summary: 'Get import status by job ID' })
  @ApiParam({ name: 'jobId', description: 'Import job ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the current status of the import job',
    type: ImportStatusDto,
  })
  async getImportStatus(
    @Param('jobId') jobId: string,
  ): Promise<ImportStatusDto> {
    return this.importService.getImportStatus(jobId);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active import jobs' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns list of active import jobs',
    type: [ImportStatusDto],
  })
  async getActiveImports(): Promise<ImportStatusDto[]> {
    return this.importService.getActiveImports();
  }

  @Get('history')
  @ApiOperation({ summary: 'Get import history (completed and failed jobs)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns list of completed and failed import jobs',
    type: [ImportStatusDto],
  })
  async getImportHistory(): Promise<ImportStatusDto[]> {
    return this.importService.getImportHistory();
  }
}
