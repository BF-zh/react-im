import { EntityRepository, FilterQuery } from '@mikro-orm/mysql'
import { BaseEntity } from './base.entity'

export class BaseRepository<T extends BaseEntity> extends EntityRepository<T> {
  findById(id: number): Promise<T | null> {
    return this.findOne({ id } as FilterQuery<T>)
  }

  find
}
