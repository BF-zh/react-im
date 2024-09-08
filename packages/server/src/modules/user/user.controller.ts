import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, Version } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { SetRole } from '@common/guards'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { FindUserListDto } from './dto/find-user.dto'

@Controller({
  path: 'user',
})
@ApiTags('用户接口')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ description: '创建用户' })
  @SetRole(['admin'])
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @Get()
  // @SetRole(['admin'])
  findAll(@Query('page', ParseIntPipe) page: number, @Query('pageSize', ParseIntPipe) pageSize: number, @Query() data: FindUserListDto) {
    return this.userService.findAll({ page, pageSize, ...data })
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findById(+id)
  }

  @Get('/detail/:id')
  detail(@Param('id') id: string) {
    return this.userService.userInfo(+id)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto)
  }

  @Delete(':id')
  @SetRole(['admin'])
  remove(@Param('id') id: string) {
    return this.userService.remove(+id)
  }
}
