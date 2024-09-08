import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@mikro-orm/nestjs'
import { BaseRepository } from '@common/database'
import { User } from '@entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { FindUserListDto } from './dto/find-user.dto'

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repository: BaseRepository<User>) {}

  create(User: CreateUserDto) {
    return this.repository.create(User)
  }

  async findorCreate(User: CreateUserDto) {
    return User
  }

  async userInfo(id: number) {
    return id
  }

  private getPrviteUser(User: UpdateUserDto & { id?: number }) {
    return User
  }

  async findById(id: number) {
    return this.repository.findById(id)
  }

  findByUsername(username: string) {
    return username
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return { id, updateUserDto }
  }

  remove(id: number) {
    return id
  }

  async findAll({ keyword, sortBy, order, page, pageSize }: FindUserListDto) {
    return { keyword, sortBy, order, page, pageSize }
  }
}
