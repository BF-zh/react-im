import process from 'node:process'
import type { INestApplication, ValidationPipeOptions } from '@nestjs/common'
import { Logger } from '@nestjs/common'
import type { ConfigService } from '@nestjs/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { getMiddleware } from 'swagger-stats'
import {
  IS_PUBLIC_KEY_META,
  SWAGGER_API_CURRENT_VERSION,
  SWAGGER_API_ENDPOINT,
  SWAGGER_DESCRIPTION,
  SWAGGER_TITLE,
} from '@common/constant'
import chalk from 'chalk'
import { HelperService } from './helpers.utils'

const logger = new Logger('App:Utils')

export const AppUtils = {
  validationPipeOptions(): ValidationPipeOptions {
    return {
      whitelist: true,
      transform: true,
      forbidUnknownValues: false,
      validateCustomDecorators: true,
      enableDebugMessages: true,
    }
  },

  async gracefulShutdown(app: INestApplication, code: string) {
    setTimeout(() => process.exit(1), 5000)
    logger.verbose(`Signal received with code ${code} ⚡.`)
    logger.log('❗Closing http server with grace.')

    try {
      await app.close()
      logger.log('✅ Http server closed.')
      process.exit(0)
    }
    catch (error: any) {
      logger.error(`❌ Http server closed with error: ${error}`)
      process.exit(1)
    }
  },

  killAppWithGrace(app: INestApplication) {
    process.on('SIGINT', async () => {
      await AppUtils.gracefulShutdown(app, 'SIGINT')
    })

    process.on('SIGTERM', async () => {
      await AppUtils.gracefulShutdown(app, 'SIGTERM')
    })
  },

  setupSwagger(app: INestApplication, configService: ConfigService<Configs, true>) {
    const logger = new Logger('Swagger')
    const { username: userName, password: passWord } = configService.get('swagger', { infer: true })
    const appName = configService.get('app.name', { infer: true })

    const options = new DocumentBuilder()
      .setTitle(SWAGGER_TITLE)
      .addBearerAuth()
      .setDescription(SWAGGER_DESCRIPTION)
      .setVersion(SWAGGER_API_CURRENT_VERSION)
      .build()

    const document = SwaggerModule.createDocument(app, options, {})
    const paths = Object.values((document).paths)

    for (const path of paths) {
      const methods = Object.values(path) as { security: string[] }[]

      for (const method of methods) {
        if (
          Array.isArray(method.security) && method.security.includes(IS_PUBLIC_KEY_META)) {
          method.security = []
        }
      }
    }

    app.use(
      getMiddleware({
        swaggerSpec: document,
        authentication: true,
        hostname: appName,
        uriPath: '/stats',
        onAuthenticate: (_request: any, username: string, password: string) => {
          return username === userName && password === passWord
        },
      }),
    )
    SwaggerModule.setup(SWAGGER_API_ENDPOINT, app, document, {
      explorer: true,
    })
    const port = configService.get('app.port', { infer: true })
    const docUrl = `http://localhost:${port}/${SWAGGER_API_ENDPOINT}`
    if (HelperService.isDev()) {
      logger.log(`==========================================================`)
      logger.log(`📑 Swagger is running on: ${chalk.blueBright(docUrl)}`)
      logger.log(`==========================================================`)
    }
  },
}
