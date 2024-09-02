import { LoggerMiddleware } from './logger.middleware'

describe('loggerMiddleware', () => {
  it('should be defined', () => {
    expect(new LoggerMiddleware()).toBeDefined()
  })
})
