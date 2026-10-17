import { Migration } from '@mikro-orm/migrations';

export class Migration20261017024944 extends Migration {

  override name = 'Migration20261017024944';

  override up(): void | Promise<void> {
    this.addSql(`create table "accounts" ("id" uuid not null default gen_random_uuid(), "holder_name" varchar(255) not null, "balance_in_cents" int not null, "currency" varchar(255) not null default 'BRL', primary key ("id"));`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "accounts" cascade;`);
  }

}
