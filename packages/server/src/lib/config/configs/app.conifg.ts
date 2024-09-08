import process from 'node:process'
import { registerAs } from '@nestjs/config'
import Joi from 'joi'
import { APP_ENVIRONMENTS } from '@common/constant'

// validation schema

export const appConfigValidationSchema = {
  NODE_ENV: Joi.string()
    .valid(...APP_ENVIRONMENTS)
    .required(),
  APP_PORT: Joi.number().port().required(),
  APP_NAME: Joi.string().optional().allow('React-im'),
  API_URL: Joi.string().uri().required(),
  APP_PREFIX: Joi.string().optional().allow(''),
  ALLOWED_HOSTS: Joi.string().optional().allow('*'),
}

// config
export const app = registerAs('app', () => ({
  port: process.env.APP_PORT,
  prefix: process.env.APP_PREFIX,
  env: process.env.NODE_ENV,
  url: process.env.API_URL,
  name: process.env.APP_NAME,
  allowedOrigins: process.env?.ALLOWED_ORIGINS?.split(',') ?? '*',
}))
