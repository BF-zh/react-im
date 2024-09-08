import { AuthGuard, RoleGuard } from '@common/guards'
import { ResponseInterceptor } from '@common/interceptors'
import { NestConfigModule, NestOrmModule, NestPinoModule } from '@lib/index'
import { ScheduleModule } from '@nestjs/schedule'
import { Module } from '@nestjs/common'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { NestJwtModule } from '@lib/jwt.module'
import { AuthModule } from '@modules/auth/auth.module'
import { ValidationPipe } from '@common/pipes'
import { HttpExceptionFilter } from '@common/filters'

@Module({
  imports: [
    NestConfigModule,
    AuthModule,
    NestJwtModule,
    NestPinoModule,
    NestOrmModule,
    ScheduleModule.forRoot(),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_PIPE,
      useValue: ValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class SharedModule {

}
