import process from 'node:process'
import { registerAs } from '@nestjs/config'
import Joi from 'joi'
import { JWT_EXPIRY_REGEX } from '@common/constant'
import { isNumber } from 'helper-fns'

/**
 * NOTE:
 * Expiry can be either number or string
 * A numeric value is interpreted as a seconds count
 * if number, parse to string
 *
 */

export const jwtConfigValidationSchema = {
  JWT_SECRET: Joi.string().required().min(8),
  JWT_PRIVATE_KEY: Joi.string().required(),
  JWT_PUBLIC_KEY: Joi.string().required().min(8),
  JWT_EXPIRES_IN: Joi.string().regex(JWT_EXPIRY_REGEX).required(),
}

export const jwt = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  algorithm: process.env?.JWT_ALGORITHM ?? 'HS256',
  accessExpiry: isNumber(process.env.JWT_ACCESS_EXPIRY)
    ? +process.env.JWT_ACCESS_EXPIRY
    : process.env.JWT_ACCESS_EXPIRY,
  refreshExpiry: isNumber(process.env.JWT_REFRESH_EXPIRY)
    ? +process.env.JWT_REFRESH_EXPIRY
    : process.env.JWT_REFRESH_EXPIRY,
  magicLinkExpiry: isNumber(process.env.MAGIC_LINK_EXPIRY)
    ? +process.env.MAGIC_LINK_EXPIRY
    : process.env.MAGIC_LINK_EXPIRY,
}))
