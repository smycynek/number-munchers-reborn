import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BaseExpressionComponent, toNumber } from '../base-expression/base-expression.component';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-percentage-expression',
  templateUrl: './percentage-expression.component.html',
  styleUrl: './percentage-expression.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe],
})
export class PercentageExpressionComponent extends BaseExpressionComponent {
  readonly percentageValue = input.required({ transform: toNumber });

  readonly stringValue = input.required<string>();

  public isPunctuationPhrase(): boolean {
    return false;
  }
}
