export class DataCell {
  constructor(
    public value: number,
    public valid: boolean,
    public discovered: boolean) { }

  public toString(): string {
    return `Value: ${this.value} Valid: ${this.valid} Discovered: ${this.discovered}`;
  }
}