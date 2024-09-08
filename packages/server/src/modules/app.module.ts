import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { AppController } from './app.controller'
import { SharedModule } from './shared/shared.module'

@Module({
  controllers: [
    AppController,
  ],
  imports: [SharedModule],
})
export class AppModule {

}
