import { ApiTags } from '@nestjs/swagger'
import { IsEmail, IsEnum, IsNotEmpty, IsString, isNotEmpty } from 'class-validator'

export enum Role {
  Admin = 'admin',
  User = 'user',
}

export class CreateUserDto {
  id: number
  username: string
  email: string
  password: string
  role: string
  status: string
  created_at: Date
  updated_at: Date
  deleted_at: Date
}
