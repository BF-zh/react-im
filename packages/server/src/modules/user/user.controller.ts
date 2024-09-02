import { Body, Controller, Delete, Get, Param, Patch, Post, Version } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { SetRole } from 'src/guards/role.guard'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Controller({
  path: 'user',
})
@ApiTags('用户接口')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ description: '创建用户' })
  create(@Body() createUserDto: CreateUserDto) {
    return console.log(createUserDto)
  }

  @Get()
  findAll() {
    return 'this is the user controller'
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findById(+id)
  }

  @Get('/detail/:id')
  detail(@Param('id') id: string) {
    return this.userService.userInfo(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto)
  }

  @Delete(':id')
  @SetRole(['admin'])
  remove(@Param('id') id: string) {
    return this.userService.remove(+id)
  }
}
