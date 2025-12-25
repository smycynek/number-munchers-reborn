import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  BaseExpressionComponent,
  toNumber,
} from '../base-expression/base-expression.component';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-logarithm-expression',
  templateUrl: './logarithm-expression.component.html',
  styleUrl: './logarithm-expression.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe]
})
export class LogarithmExpressionComponent extends BaseExpressionComponent {
  readonly coefficient = input.required({ transform: toNumber });
  readonly base = input.required({ transform: toNumber });
  readonly argument = input.required({ transform: toNumber });

     readonly stringValue = input.required<string>();
  
  public isPunctuationPhrase(): boolean {
    return false;
  }
}
