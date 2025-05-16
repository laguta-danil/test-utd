import { HttpService } from '@nestjs/axios';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { Queue } from 'bull';
import { firstValueFrom } from 'rxjs';
import { Configuration } from 'src/config/configuration';
import { AppException } from '../../common/exceptions/app.exception';
import {
  DummyJsonResponse,
  ImportResponseDto,
  ImportStatusDto,
} from './dto/import.dto';

@Injectable()
export class ImportService {
  private readonly logger = new Logger(ImportService.name);
  private readonly apiUrl: string;

  constructor(
    @InjectQueue('product-import') private readonly importQueue: Queue,
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

  async startImport(): Promise<ImportResponseDto> {
    this.logger.log('Starting import job');
    try {
      // Get data from External API first
      const { data } = await firstValueFrom<AxiosResponse<DummyJsonResponse>>(
        this.httpService.get<DummyJsonResponse>(this.apiUrl),
      );

      // Add task to queue
      const job = await this.importQueue.add(
        'import-products',
        {
          timestamp: new Date().toISOString(),
        },
        {
          attempts: 3, // Number of retry attempts
          backoff: {
            type: 'exponential',
            delay: 1000, // Initial delay in ms
          },
          removeOnComplete: 24 * 3600, // Store completed tasks for 24 hours
          removeOnFail: false, // Keep failed tasks for analysis
        },
      );

      this.logger.log(`Import job started with ID: ${job.id}`);

      return {
        jobId: job.id.toString(),
        status: 'started',
        startedAt: new Date(),
        totalItems: data.total,
        skip: data.skip,
        limit: data.limit,
        items: data.products,
      };
    } catch (error: unknown) {
      this.handleError(error, 'Failed to start import job');
    }
  }

  async getImportStatus(jobId: string): Promise<ImportStatusDto> {
    try {
      const job = await this.importQueue.getJob(jobId);

      if (!job) {
        throw new AppException(
          `Job with ID ${jobId} not found`,
          'Import Status',
          undefined,
          404,
        );
      }

      const state = await job.getState();
      const progress = (await job.progress()) as number;
      const result = job.returnvalue as {
        processedItems: number;
        totalItems: number;
        deletedItems: number;
      } | null;

      return {
        jobId: job.id.toString(),
        status: state,
        progress,
        processedItems: result?.processedItems ?? 0,
        totalItems: result?.totalItems ?? 0,
        deletedItems: result?.deletedItems ?? 0,
        startedAt: job.processedOn ? new Date(job.processedOn) : new Date(),
        finishedAt: job.finishedOn ? new Date(job.finishedOn) : undefined,
        error: job.failedReason,
      };
    } catch (error: unknown) {
      this.handleError(error, 'Failed to get import status');
    }
  }

  async getActiveImports(): Promise<ImportStatusDto[]> {
    try {
      const jobs = await this.importQueue.getJobs([
        'active',
        'waiting',
        'delayed',
      ]);
      return Promise.all(
        jobs.map((job) => this.getImportStatus(job.id.toString())),
      );
    } catch (error: unknown) {
      this.handleError(error, 'Failed to get active imports');
    }
  }

  async getImportHistory(): Promise<ImportStatusDto[]> {
    try {
      const jobs = await this.importQueue.getJobs(['completed', 'failed']);
      return Promise.all(
        jobs.map((job) => this.getImportStatus(job.id.toString())),
      );
    } catch (error: unknown) {
      this.handleError(error, 'Failed to get import history');
    }
  }
}
