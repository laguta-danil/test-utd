import { ConfigService } from '@nestjs/config';

export const bullConfig = (configService: ConfigService) => ({
  redis: {
    host: configService.get<string>('redis.host'),
    port: configService.get<number>('redis.port'),
  },
});
