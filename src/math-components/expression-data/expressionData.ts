import { logWithBase } from '../../app/utility';

export const MixedNumberExpressionName = 'MixedNumberExpressionName';
export const AdditionExpressionName = 'AdditionExpressionName';
export const SubtractionExpressionName = 'SubtractionExpressionName';
export const DivisionExpressionName = 'DivisionExpressionName';
export const MultiplicationExpressionName = 'MultiplicationExpressionName';
export const ExponenentExpressionName = 'ExponenentExpressionName';
export const RootExpressionName = 'RootExpressionName';
export const StringExpressionName = 'StringExpressionName';
export const LogarithmExpressionName = 'LogarithmExpressionName';
export const PercentageExpressionName = 'PercentageExpressionName';
export const DecimalExpressionName = 'DecimalExpressionName';

// It would be nice if we could use the type name
// property directly, but it gets mangled by the optimizer.
// There may be another, better way.
export type ExpressionTypes =
  | ExpressionData
  | MixedNumberExpressionData
  | StringExpressionData
  | AdditionExpressionData
  | SubtractionExpressionData
  | MultiplicationExpressionData
  | DivisionExpressionData
  | RootExpressionData
  | ExponentExpressionData
  | LogarithmExpressionData
  | PercentageExpressionData
  | DecimalExpressionData;

export class ExpressionData {
  constructor(
    public value: number,
    public opType: string,
  ) {}
  [key: string]: unknown; // Needed to index subclass properties
  public toString(): string {
    return `opType: ${this.opType}, value: ${this.value}`;
  }
  public getHashCode(): string {
    return JSON.stringify(this); // obviously not ideal
  }
  public clone(): ExpressionTypes {
    return { ...this };
  }
}

export class StringExpressionData extends ExpressionData {
  public constructor(public stringValue: string) {
    super(0, StringExpressionName);
  }
}

export function s(value: string): StringExpressionData {
  return new StringExpressionData(value);
}

export class MixedNumberExpressionData extends ExpressionData {
  public constructor(
    public whole: number,
    public numerator: number,
    public denominator: number,
    public showRval = false,
    public displayOp = '',
    public displayRval = NaN,
  ) {
    let fraction = 0;
    if (!isNaN(numerator / denominator)) {
      fraction = Math.abs(numerator / denominator);
    }
    super(
      (Math.abs(whole) + fraction) * (whole < 0 ? -1 : 1),
      MixedNumberExpressionName,
    );
  }
}

export class PercentageExpressionData extends ExpressionData {
  public constructor(
    public percentageValue: number,
    public showRval = false,
    public displayOp = '',
    public displayRval = NaN,
  ) {
    const value = percentageValue / 100;
    super(value, PercentageExpressionName);
  }
}

export class DecimalExpressionData extends ExpressionData {
  public constructor(
    public decimalValue: number,
    public showRval = false,
    public displayOp = '',
    public displayRval = NaN,
  ) {
    const value = decimalValue;
    super(value, DecimalExpressionName);
  }
}

export class AdditionExpressionData extends ExpressionData {
  public constructor(
    public left: number,
    public right: number,
    public showRval = false,
    public displayOp = '',
    public displayRval = NaN,
  ) {
    super(left + right, AdditionExpressionName);
  }
}

export class SubtractionExpressionData extends ExpressionData {
  public constructor(
    public left: number,
    public right: number,
    public showRval = false,
    public displayOp = '',
    public displayRval = NaN,
  ) {
    super(left - right, SubtractionExpressionName);
  }
}

export class MultiplicationExpressionData extends ExpressionData {
  public constructor(
    public left: number,
    public right: number,
    public showRval = false,
    public displayOp = '',
    public displayRval = NaN,
  ) {
    super(left * right, MultiplicationExpressionName);
  }
}

export class DivisionExpressionData extends ExpressionData {
  public constructor(
    public left: number,
    public right: number,
    public showRval = false,
    public displayOp = '',
    public displayRval = NaN,
  ) {
    super(left / right, DivisionExpressionName);
  }
}

function fracPart(value: number): number {
  return value - Math.trunc(value);
}

function roundIf(value: number): number {
  const fraction = fracPart(value);
  if (fraction < 0.01 || fraction > 0.99) {
    return Math.round(value);
  }
  return value;
}

export class ExponentExpressionData extends ExpressionData {
  public constructor(
    public base: number,
    public power: number,
    public showRval = false,
    public displayOp = '',
    public displayRval = NaN,
  ) {
    super(Math.pow(base, power), ExponenentExpressionName);
  }
}

export class RootExpressionData extends ExpressionData {
  public constructor(
    public coefficient: number,
    public index: number,
    public radicand: number,
    public showRval = false,
    public displayOp = '',
    public displayRval = NaN,
  ) {
    super(
      roundIf(coefficient * Math.pow(radicand, 1 / index)),
      RootExpressionName,
    );
  }
}

export class LogarithmExpressionData extends ExpressionData {
  public constructor(
    public coefficient: number,
    public base: number,
    public argument: number,
    public showRval = false,
    public displayOp = '',
    public displayRval = NaN,
  ) {
    super(coefficient * logWithBase(argument, base), LogarithmExpressionName);
  }
}
