import { Migration } from '@mikro-orm/migrations';

export class Migration20240906051550 extends Migration {

  override async up(): Promise<void> {
    this.addSql('drop table if exists `mikro_orm_migrations`;');

    this.addSql('alter table `user` modify `updated_at` datetime not null default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment \'更新时间\';');
  }

  override async down(): Promise<void> {
    this.addSql('create table `mikro_orm_migrations` (`id` int unsigned not null auto_increment primary key, `name` varchar(255) null, `executed_at` datetime null default CURRENT_TIMESTAMP) default character set utf8mb4 engine = InnoDB;');

    this.addSql('alter table `user` modify `updated_at` datetime not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP comment \'更新时间\';');
  }

}
