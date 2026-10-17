import { Decimal } from 'decimal.js';
import { domainError } from '../errors/domain.error.js';

export interface IMoneyVO {
    amount: string;
    currency: string;
}

export class MoneyVO {
    private constructor(private readonly amount: Decimal, public readonly currency: string) {}

    public static from(props: IMoneyVO): MoneyVO {
        if (!props.amount || !props.currency) {
            throw new domainError('Invalid money value object properties');
        }

        const trimmedAmount = props.amount.trim();

        if(/[eE]/.test(trimmedAmount) || !/^\d+(\.\d+)?$/.test(trimmedAmount)) {
            throw new domainError('Invalid money amount format');
        }

        const parts = trimmedAmount.split('.');
        if(parts.length === 2 && parts[1].length > 2) {
            throw new domainError('Invalid money amount format: more than two decimal places');
        }

        try {
            const amountDecimal = new Decimal(trimmedAmount);

            if (!amountDecimal.isFinite() || amountDecimal.isNaN()) {
                throw new domainError('Invalid money amount format');
            }

            return new MoneyVO(amountDecimal, props.currency);
        } catch (error) {
            throw new domainError('Invalid money amount format');
        }
    }

    public static zero(currency: string): MoneyVO {
        return new MoneyVO(new Decimal(0), currency.toUpperCase().trim());
    }

    public add(other: MoneyVO): MoneyVO {
        this.assertSameCurrency(other);
        return new MoneyVO(this.amount.plus(other.amount), this.currency);
    }

    public subtract(other: MoneyVO): MoneyVO {
        this.assertSameCurrency(other);
        return new MoneyVO(this.amount.minus(other.amount), this.currency);
    }

    public negate(): MoneyVO {
        return new MoneyVO(this.amount.negated(), this.currency);
    }

    public isZero(): boolean {
        return this.amount.isZero();
    }

    public isPositive(): boolean {
        return this.amount.isPositive();
    }

    public isNegative(): boolean {
        return this.amount.isNegative();
    }

    public isLessThan(other: MoneyVO): boolean {
        this.assertSameCurrency(other);
        return this.amount.lessThan(other.amount);
    }

    public equals(other: MoneyVO): boolean {
        return this.currency === other.currency && this.amount.equals(other.amount);
    }

    public toJSON(): IMoneyVO {
        return {
            amount: this.amount.toFixed(2),
            currency: this.currency,
        };
    }

    public toString(): string {
        return `${this.amount.toFixed(2)} ${this.currency}`;
    }

    public getAmountAsString(): string {
        return this.amount.toFixed(2);
    }

    private assertSameCurrency(other: MoneyVO): void {
        if (this.currency !== other.currency) {
            throw new domainError('Cannot operate on MoneyVO with different currencies');
        }
    }
}