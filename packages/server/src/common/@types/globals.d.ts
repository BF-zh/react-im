import type { User as UserEntity } from '@entities'
import type { Config as ConfigInterface } from '@lib/config/config.interface'
import type { NextFunction, Request, Response } from 'express'

export {}

declare global {
  namespace Express {
    export interface Request {}
    interface User extends UserEntity {}
  }

  export type Configs = ConfigInterface

  export type NestifyRequest = Request
  export type NestifyResponse = Response
  export type NestifyNextFunction = NextFunction
}
