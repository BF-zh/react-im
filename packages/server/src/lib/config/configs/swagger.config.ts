import process from 'node:process'
import { registerAs } from '@nestjs/config'
import Joi from 'joi'

export const swaggerConfigValidationSchema = {
  SWAGGER_USERNAME: Joi.string().required(),
  SWAGGER_PASSWORD: Joi.string().required(),
}

export const swagger = registerAs('swagger', () => ({
  username: process.env.SWAGGER_USERNAME,
  password: process.env.SWAGGER_PASSWORD,
}))
