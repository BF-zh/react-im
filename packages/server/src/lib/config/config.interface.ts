import type { ConfigType } from '@nestjs/config'
import type {
  app,
  database,
  jwt,
  redis,
  swagger,
  throttle,
} from './configs'

export interface Config {
  app: ConfigType<typeof app>
  database: ConfigType<typeof database>
  jwt: ConfigType<typeof jwt>
  redis: ConfigType<typeof redis>
  swagger: ConfigType<typeof swagger>
  throttle: ConfigType<typeof throttle>
}
