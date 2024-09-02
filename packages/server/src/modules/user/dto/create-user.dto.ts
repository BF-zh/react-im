import { ApiTags } from '@nestjs/swagger'
import { IsEmail, IsEnum, IsNotEmpty, IsNotEmptyObject, IsString, isNotEmpty } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string

  @IsString({ message: '昵称必须为字符串' })
  nickname: string

  @IsNotEmptyObject({ nullable: true }, { message: 'detail不能为空' })
  detail: object

  type: 'qq' | 'wechat' | 'weibo' | 'github' | 'gitee'
  @IsString({ message: 'avatar必须为字符串' })
  avatar: string
}
