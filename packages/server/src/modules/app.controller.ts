import { Controller, Get } from '@nestjs/common'
import { PublicApi } from '@common/guards'

@Controller()
export class AppController {
  constructor() {}

  @PublicApi()
  @Get('ping')
  ping(): string {
    return 'pong'
  }
}
