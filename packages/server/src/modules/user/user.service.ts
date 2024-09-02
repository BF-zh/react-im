import { Injectable } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private repository: Repository<User>,
  ) { }

  async create(User: CreateUserDto) {
    const DUser = await this.repository.save(User)
    return DUser
  }

  async findorCreate(User: CreateUserDto) {
    const DUser = await this.findByUsername(User.username)
    if (DUser) {
      await this.update(DUser.id, User)
      return
    }
    await this.create(User)
  }

  async userInfo(id: number) {
    const { password, ...User } = await this.getPrviteUser({ id }) || {}
    return User
  }

  private getPrviteUser(User: UpdateUserDto & { id?: number }) {
    return this.repository.createQueryBuilder('user').select([
      'user.type',
      'user.id',
      'user.password',
      'user.username',
      'user.avatar',
      'user.nickname',
      'user.role',
      'user.updated_at',
      'user.created_at',
      'user.deleted_at',
      'user.status',
      'user.detail',
    ]).where(User).getOne()
  }

  async findById(id: number) {
    const User = await this.repository.findOneBy({ id })
    if (!User)
      throw new Error('用户不存在')
    return User
  }

  findByUsername(username: string) {
    return this.repository.findOneBy({ username })
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.repository.update(id, updateUserDto)
  }

  remove(id: number) {
    return this.repository.delete({ id })
  }
}
