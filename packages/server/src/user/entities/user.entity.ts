import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid', { comment: '用户id' })
  id: number

  @Column('varchar', { length: 10, comment: '用户名', unique: true })
  username: string

  @Column('varchar', { length: 20, comment: '昵称' })
  nickname: string

  @Column('varchar', { length: 20, comment: '邮箱', unique: true })
  email: string

  @Column('varchar', { length: 16, comment: '密码' })
  password: string

  @Column('enum', { enum: ['admin', 'user'], default: 'user', comment: '用户角色' })
  role: string

  @Column('boolean', { default: false, comment: '是否封禁' })
  status: string

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', comment: '创建时间' })
  created_at: Date

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', comment: '更新时间' })
  updated_at: Date

  @Column('timestamp', { comment: '删除时间' })
  deleted_at: Date
}
