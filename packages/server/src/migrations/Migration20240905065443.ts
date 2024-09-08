import { Migration } from '@mikro-orm/migrations';

export class Migration20240905065443 extends Migration {

  override async up(): Promise<void> {
    this.addSql('alter table `user` modify `created_at` datetime not null default CURRENT_TIMESTAMP comment \'创建时间\';');
  }

  override async down(): Promise<void> {
    this.addSql('alter table `user` modify `created_at` int not null;');
  }

}
