import { MikroOrmModule } from '@mikro-orm/nestjs'
import { defineConfig } from '@mikro-orm/mysql'
import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { baseOptions } from '@common/database/orm.config'
// entities
import { User } from '@entities/user.entity'

@Global()
@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Configs, true>) =>
        defineConfig({
          ...baseOptions,
          ...configService.getOrThrow('database', { infer: true }),
        }),
    }),
    MikroOrmModule.forFeature([User]),
  ],
  exports: [
    MikroOrmModule,
  ],
})
export class NestOrmModule {}
