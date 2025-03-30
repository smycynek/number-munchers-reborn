import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {  NgComponentOutlet } from '@angular/common';
import { LogarithmExpressionComponent } from '../expression-components/logarithm-expression/logarithm-expression.component';
import { MixedNumberExpressionComponent } from '../expression-components/mixed-number-expression/mixed-number-expression.component';
import { MultiplicationExpressionComponent } from '../expression-components/multiplication-expression/multiplication-expression.component';
import { StringExpressionComponent } from '../expression-components/string-expression/string-expression.component';
import { SubtractionExpressionComponent } from '../expression-components/subtraction-expression/subtraction-expression.component';
import { DivisionExpressionComponent } from '../expression-components/division-expression/division-expression.component';
import { ExponentExpressionComponent } from '../expression-components/exponent-expression/exponent-expression.component';
import { AdditionExpressionComponent } from '../expression-components/addition-expression/addition-expression.component';
import { RootExpressionComponent } from '../expression-components/root-expression/root-expression.component';
import {
  AdditionExpressionName,
  DecimalExpressionName,
  DivisionExpressionName,
  ExponenentExpressionName,
  ExpressionData,
  LogarithmExpressionName,
  MixedNumberExpressionName,
  MultiplicationExpressionName,
  PercentageExpressionName,
  RootExpressionName,
  StringExpressionName,
  SubtractionExpressionName,
} from '../expression-data/expressionData';
import { PercentageExpressionComponent } from '../expression-components/percentage-expression/percentage-expression.component';
import { DecimalExpressionComponent } from '../expression-components/decimal-expression/decimal-expression.component';

type ComponentTypes =
  | typeof StringExpressionComponent
  | typeof AdditionExpressionComponent
  | typeof SubtractionExpressionComponent
  | typeof MultiplicationExpressionComponent
  | typeof DivisionExpressionComponent
  | typeof ExponentExpressionComponent
  | typeof RootExpressionComponent
  | typeof MixedNumberExpressionComponent
  | typeof LogarithmExpressionComponent
  | typeof PercentageExpressionComponent
  | typeof DecimalExpressionComponent;

@Component({
  selector: 'app-math-expression',
  imports: [NgComponentOutlet],
  templateUrl: './math-expression.component.html',
  styleUrl: './math-expression.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MathExpressionComponent {
  readonly mathData = input.required<ExpressionData>(); // Could also be the base class ExpressionData;

  getMathComponent(): ComponentTypes {
    // Could be a factory call or a type map, but this is probably fine.

    switch (this.mathData().opType) {
      case StringExpressionName:
        return StringExpressionComponent;
      case AdditionExpressionName:
        return AdditionExpressionComponent;
      case SubtractionExpressionName:
        return SubtractionExpressionComponent;
      case MultiplicationExpressionName:
        return MultiplicationExpressionComponent;
      case DivisionExpressionName:
        return DivisionExpressionComponent;
      case ExponenentExpressionName:
        return ExponentExpressionComponent;
      case RootExpressionName:
        return RootExpressionComponent;
      case MixedNumberExpressionName:
        return MixedNumberExpressionComponent;
      case LogarithmExpressionName:
        return LogarithmExpressionComponent;
      case PercentageExpressionName:
        return PercentageExpressionComponent;
      case DecimalExpressionName:
        return DecimalExpressionComponent;
      default:
        throw Error(`Unknown math opType ${this.mathData().opType}`);
    }
  }
}
