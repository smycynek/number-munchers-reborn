import { ExpressionData } from '../math-components/expression-data/expressionData';


export class DataCell {
  constructor(
    public expressionValue: ExpressionData,
    public valid: boolean,
    public discovered: boolean) { }

  public toString(): string {
    return `${this.expressionValue.toString()} Valid: ${this.valid} Discovered: ${this.discovered}`;
  }
}