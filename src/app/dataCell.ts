export class ValuePair {
  constructor(
    public value: number,
    public valueAsString: string) { }
  public toString(): string {
    return `{Value: ${this.value}, ValueAsString: ${this.valueAsString}}`;
  }
}

export class DataCell {
  constructor(
    public valuePair: ValuePair,
    public valid: boolean,
    public discovered: boolean) { }

  public toString(): string {
    return `${this.valuePair.toString()} Valid: ${this.valid} Discovered: ${this.discovered}`;
  }
}