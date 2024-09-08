import { Migration } from '@mikro-orm/migrations';

export class Migration20240905065638 extends Migration {

  override async up(): Promise<void> {
    this.addSql('alter table `user` modify `updated_at` datetime not null default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment \'更新时间\', modify `deleted_at` datetime null comment \'删除时间\';');
  }

  override async down(): Promise<void> {
    this.addSql('alter table `user` modify `updated_at` int not null, modify `deleted_at` int not null;');
  }

}
