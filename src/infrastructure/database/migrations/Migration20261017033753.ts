import { Migration } from '@mikro-orm/migrations';

export class Migration20261017033753 extends Migration {

  override name = 'Migration20261017033753';

  override up(): void | Promise<void> {
    this.addSql(`create table "wallets" ("id" uuid not null, "player_id" uuid not null, "currency" varchar(3) not null, "balance_amount" varchar(255) not null, "version" int not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`);

    this.addSql(`drop table if exists "accounts" cascade;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`create table "accounts" ("balance_in_cents" int not null, "currency" varchar(255) not null default 'BRL', "holder_name" varchar(255) not null, "id" uuid not null default gen_random_uuid(), primary key ("id"));`);

    this.addSql(`drop table if exists "wallets" cascade;`);
  }

}
