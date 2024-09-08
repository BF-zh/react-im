import { Module } from '@nestjs/common'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { User } from '@entities/user.entity'
import { UserService } from './user.service'
import { UserController } from './user.controller'

@Module({
  exports: [UserService],
  imports: [],
  controllers: [UserController],
  providers: [UserService, UserModule],
})
export class UserModule {}
