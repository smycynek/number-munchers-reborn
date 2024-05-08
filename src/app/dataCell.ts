export class DataCell {
  constructor(
    public readonly value: number,
    public readonly valid: boolean,
    public discovered: boolean) { }

  public toString(): string {
    return `Value: ${this.value} Valid: ${this.valid} Discovered: ${this.discovered}`;
  }
}