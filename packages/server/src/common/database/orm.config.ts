import process from 'node:process'
import { Logger } from '@nestjs/common'
import { MySqlDriver, Options } from '@mikro-orm/mysql'

import { SqlHighlighter } from '@mikro-orm/sql-highlighter'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import { Migrator } from '@mikro-orm/migrations'
import { EntityGenerator } from '@mikro-orm/entity-generator'
import { SeedManager } from '@mikro-orm/seeder'
import { BaseRepository } from './base.repository'

const logger = new Logger('MikroORM')
export const baseOptions: Options = {
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  debug: true,
  driver: MySqlDriver,
  forceUtcTimezone: true,
  highlighter: new SqlHighlighter(),
  metadataProvider: TsMorphMetadataProvider,
  logger: logger.log.bind(logger),
  baseDir: process.cwd(),
  allowGlobalContext: true,
  migrations: {
    fileName: (timestamp: string, name?: string) => {
      if (name == null)
        return `Migration${timestamp}`
      return `Migration${timestamp}_${name}`
    },
    tableName: 'migrations', // name of database table with log of executed transactions
    path: './migrations', // path to the folder with migrations
    pathTs: undefined, // path to the folder with TS migrations (if used, we should put path to compiled files in `path`)
    glob: '!(*.d).{js,ts}', // how to match migration files (all .js and .ts files, but not .d.ts)
    transactional: true, // wrap each migration in a transaction
    allOrNothing: true, // wrap all migrations in master transaction
    snapshot: true, // save snapshot when creating new migrations
  },
  extensions: [Migrator, EntityGenerator, SeedManager],
  entityRepository: BaseRepository,
}
