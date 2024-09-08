import { Entity, PrimaryKey, Property } from '@mikro-orm/mysql'
import { BaseRepository } from './base.repository'

@Entity({ abstract: true })
export abstract class BaseEntity {
  @PrimaryKey({ comment: '主键' })
  id: number

  @Property({ default: false, comment: '是否删除' })
  is_delete: boolean = false

  @Property({ type: 'timestamp', defaultRaw: `CURRENT_TIMESTAMP`, comment: '创建时间' })
  createdAt: number

  @Property({ type: 'timestamp', defaultRaw: `CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`, comment: '更新时间' })
  updated_at: number

  @Property({ type: 'timestamp', nullable: true, comment: '删除时间' })
  deleted_at: number | null = null
}
