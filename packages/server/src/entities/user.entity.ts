import { Entity, Property } from '@mikro-orm/mysql'
import { BaseEntity } from '@common/database'

@Entity()
export class User extends BaseEntity {
  @Property()
  username: string

  @Property()
  type: string

  @Property()
  avatar: string

  @Property()
  nickname: string

  @Property()
  detail: object

  @Property()
  password: string

  @Property()
  role: string

  @Property()
  status: string
}
