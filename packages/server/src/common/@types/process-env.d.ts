/* The `export {};` statement is used to indicate that the file is a module and exports nothing. It is
often used in TypeScript files that only contain type declarations or interfaces, without any actual
code or exports. This statement ensures that the file is treated as a module and not as a script. */
export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_PORT: number
      APP_PREFIX: string
      APP_NAME: string
      NODE_ENV:
        | 'dev'
        | 'development'
        | 'stage'
        | 'staging'
        | 'test'
        | 'testing'
        | 'prod'
        | 'production'

      API_URL: string
      CLIENT_URL: string
      SWAGGER_USERNAME: string
      SWAGGER_PASSWORD: string

      DB_HOST: string
      DB_PORT: number
      DB_USERNAME: string
      DB_PASSWORD: string
      DB_DATABASE: string

      JWT_ACCESS_EXPIRY: string
      JWT_REFRESH_EXPIRY: string
      MAGIC_LINK_EXPIRY: string
      JWT_SECRET: string

      REDIS_TTL: number
      REDIS_URI: string
      REDIS_HOST: string
      REDIS_PASSWORD: string
      REDIS_USERNAME: string
      REDIS_PORT: number
    }
  }
}
