import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis'

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Configs, true>) => ({
        ttl: configService.get('throttle.ttl', { infer: true }),
        limit: configService.get('throttle.limit', { infer: true }),
        storage: new ThrottlerStorageRedisService(configService.getOrThrow('redis', { infer: true })),
        throttlers: [],
      }),
    }),
  ],
  exports: [ThrottlerModule],
})
export class NestThrottlerModule {}
