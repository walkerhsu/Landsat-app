export class CompensationModel {
  constructor(
    private amount: number,
    private frequency: string,
    private effectiveDate: string
  ) {}

  static create(
    amount: number,
    frequency: string,
    effectiveDate: string
  ): CompensationModel {
    return new CompensationModel(amount, frequency, effectiveDate);
  }

  public getAmount() {
    return this.amount;
  }

  public getFrequency() {
    return this.frequency;
  }

  public getEffectiveDate() {
    return this.effectiveDate;
  }

  public updateAmount(newAmount: number) {
    this.amount = newAmount;
  }

  public clone() {
    return new CompensationModel(
      this.amount,
      this.frequency,
      this.effectiveDate
    );
  }
}
