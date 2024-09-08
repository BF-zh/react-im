import process from 'node:process'
import { NestFactory } from '@nestjs/core'
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common'
import { ResponseInterceptor } from '@common/interceptors'
import { HttpExceptionFilter } from '@common/filters'
import { InternalDisabledLogger } from '@lib/pino'
import chalk from 'chalk'
import compression from 'compression'
import { AppUtils } from '@common/helpers'
import { ConfigService } from '@nestjs/config'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import helmet from 'helmet'
import { SocketIOAdapter } from '@common/adapter/socket.adapter'
import { AppModule } from './modules/app.module'

const logger = new Logger('Bootstrap')
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
    logger: new InternalDisabledLogger(),
  })
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
  })
  app.use(compression())
  app.use(helmet())
  const configService = app.get(ConfigService<Configs, true>)
  const globalPrefix = configService.get('app.prefix', { infer: true })

  // =========================================================
  // configure socket
  // =========================================================

  const redisIoAdapter = new SocketIOAdapter(app, configService)

  await redisIoAdapter.connectToRedis()
  app.useWebSocketAdapter(redisIoAdapter)

  // =========================================================
  // configure shutdown hooks
  // =========================================================

  app.setGlobalPrefix(globalPrefix)
  app.enableCors()
  const port = process.env.PORT ?? configService.get('app.port', { infer: true })!
  AppUtils.setupSwagger(app, configService)
  await app.listen(port)

  const appUrl = `http://localhost:${port}/${globalPrefix}`

  logger.log(`==========================================================`)
  logger.log(`🚀 Application is running on: ${chalk.blueBright(appUrl)}`)
  logger.log(`==========================================================`)
}
bootstrap()
