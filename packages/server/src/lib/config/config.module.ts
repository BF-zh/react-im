import process from 'node:process'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Module } from '@nestjs/common'
import Joi from 'joi'
import {
  app,
  appConfigValidationSchema,
  database,
  databaseConfigValidationSchema,
  jwt,
  jwtConfigValidationSchema,
  redis,
  redisConfigValidationSchema,
  swagger,
  swaggerConfigValidationSchema,
  throttle,
  throttleConfigValidationSchema,
} from './configs'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${process.cwd()}/.env.${process.env.NODE_ENV}`],
      load: [
        app,
        jwt,
        database,
        redis,
        swagger,
        throttle,
      ],
      cache: true,
      isGlobal: true,
      expandVariables: true,
      validationSchema: Joi.object({
        ...appConfigValidationSchema,
        ...jwtConfigValidationSchema,
        ...databaseConfigValidationSchema,
        ...swaggerConfigValidationSchema,
        ...redisConfigValidationSchema,
        ...throttleConfigValidationSchema,
      }),
      validationOptions: {
        abortEarly: true,
        cache: true,
        debug: true,
        stack: true,
      },
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class NestConfigModule {}
