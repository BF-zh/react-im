import { ApiProperty, ApiTags } from '@nestjs/swagger'
import { IsEmail, IsEnum, IsNotEmpty, IsNotEmptyObject, IsString, MaxLength, MinLength, isNotEmpty } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  @ApiProperty({ description: '用户名', example: 'test' })
  @MaxLength(20, { message: '用户名长度不能超过20' })
  username: string

  @IsString({ message: '昵称必须为字符串' })
  @ApiProperty({ description: '昵称', example: '北风' })
  @MaxLength(20, { message: '昵称长度不能超过20' })
  @MinLength(1, { message: '昵称长度不能少于1' })
  nickname: string

  @ApiProperty({ description: '用户详情', example: {} })
  detail: object

  @IsEnum(['qq', 'wechat', 'weibo', 'github', 'gitee'], { message: '登录方式错误' })
  @ApiProperty({ description: '登录方式', example: 'qq', enum: ['qq', 'wechat', 'weibo', 'github', 'gitee'] })
  type: 'qq' | 'wechat' | 'weibo' | 'github' | 'gitee'

  @IsString({ message: 'avatar必须为字符串' })
  @ApiProperty({ description: '头像', example: 'https://example.com/avatar.jpg' })
  avatar: string
}
