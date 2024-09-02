import { BeforeRemove, BeforeSoftRemove, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class User {
  @BeforeSoftRemove()
  beforeRemove() {
    this.is_delete = true
  }

  @PrimaryGeneratedColumn({ comment: '用户id' })
  id: number

  @Column('varchar', { length: 10, comment: '用户名', unique: true })
  username: string

  @Column('enum', { enum: ['qq', 'weixin', 'github'], comment: '第三方登录类型' })
  type: string

  @Column('varchar', { comment: '头像' })
  avatar: string

  @Column('varchar', { length: 20, comment: '昵称' })
  nickname: string

  @Column('json', { comment: '第三方登录信息', select: false })
  detail: object

  @Column('varchar', { length: 16, comment: '密码', nullable: true, select: false })// select: false 表示查询时不会返回该字段
  password: string

  @Column('enum', { enum: ['admin', 'user'], default: 'user', comment: '用户角色' })
  role: string

  @Column('boolean', { default: false, comment: '是否封禁' })
  status: string

  @Column('boolean', { default: false, select: false, comment: '是否删除' })
  is_delete: boolean

  @CreateDateColumn({ comment: '创建时间' })
  created_at: Date

  @UpdateDateColumn({ comment: '更新时间' })
  updated_at: Date

  @DeleteDateColumn({ comment: '删除时间' })
  deleted_at: Date
}
