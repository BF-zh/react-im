import { ApiProperty } from '@nestjs/swagger'
import { QueryListDto } from '@common/dto/query-list.dto'

export class FindUserDto {

}

export class FindUserListDto extends QueryListDto {
  @ApiProperty({ required: false, default: '', example: '北风', description: '关键字,可以为用户名或者昵称' })
  keyword?: string
}
