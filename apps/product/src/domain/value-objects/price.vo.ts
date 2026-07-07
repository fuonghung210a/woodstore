export class Price {
  constructor(
    readonly amount: number,
    readonly currency: string = 'VND',
  ) {
    if (amount < 0) {
      throw new Error('Price cannot be negative');
    }
    if (!currency || currency.trim().length === 0) {
      throw new Error('Currency must be a non-empty string');
    }
  }

  equals(other: Price): boolean {
    return this.amount  === other.amount && this.currency === other.currency;
  }
}
