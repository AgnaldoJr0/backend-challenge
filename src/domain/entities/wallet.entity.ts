import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';
import { MoneyVO } from '../value-objects/money.vo.js';
import { domainError } from '../errors/domain.error.js';

export interface IWalletEntity {
    id: string;
    playerId: string;
    currency: string;
    balanceAmount: string;
    version: number;
    createdAt: Date;
    updatedAt: Date;
}

@Entity({ tableName: 'wallets' })
export class Wallet{
  @PrimaryKey({ type: 'uuid' })
  public readonly id!: string;

  @Property({ type: 'uuid' })
  public readonly playerId!: string;

  @Property({ type: 'string', length: 3 })
  public readonly currency!: string;

  @Property({ type: 'string' })
  public balanceAmount!: string;

  @Property({ type: 'integer'})
  public version!: number;

  @Property({ type: 'datetime' })
  public readonly createdAt!: Date;

  @Property({ type: 'datetime' })
  public updatedAt!: Date;

  private constructor(
    id: string,
    playerId: string,
    currency: string,
    initialBalance: MoneyVO,
    version: number,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.playerId = playerId;
    this.currency = currency.toUpperCase().trim();
    this.balanceAmount = initialBalance.getAmountAsString();
    this.version = version;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.assertSameCurrency(initialBalance);
  }

  public static open(props: { id: string; playerId: string; initialBalance: MoneyVO }): Wallet {
    const now = new Date();
    return new Wallet(
      props.id,
      props.playerId,
      props.initialBalance.currency,
      props.initialBalance,
      1,
      now,
      now,
    );
  }

  public static rehydrate(state: IWalletEntity): Wallet {
    const money = MoneyVO.from({ amount: state.balanceAmount, currency: state.currency });
    return new Wallet(
      state.id,
      state.playerId,
      state.currency,
      money,
      state.version,
      state.createdAt,
      state.updatedAt,
    );
  }

  public getBalance(): MoneyVO {
    return MoneyVO.from({ amount: this.balanceAmount, currency: this.currency });
  }

  public getVersion(): number {
    return this.version;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public debit(amount: MoneyVO): void {
    this.assertSameCurrency(amount);

    if (this.getBalance().isLessThan(amount)) {
      throw new domainError('Saldo insuficiente para realizar esta operação de débito.');
    }

    const newBalance = this.getBalance().subtract(amount);
    this.balanceAmount = newBalance.getAmountAsString();
    
    this.version++;
    this.updatedAt = new Date();
  }

  public credit(amount: MoneyVO): void {
    this.assertSameCurrency(amount);

    const newBalance = this.getBalance().add(amount);
    this.balanceAmount = newBalance.getAmountAsString();

    this.version++;
    this.updatedAt = new Date();
  }

  private assertSameCurrency(money: MoneyVO): void {
    if (money.currency !== this.currency) {
      throw new domainError(`Currency mismatch: Wallet currency is ${this.currency}, but MoneyVO currency is ${money.currency}`);
    }
  }
}