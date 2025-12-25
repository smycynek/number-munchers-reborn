import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BaseExpressionComponent, toNumber } from '../base-expression/base-expression.component';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-division-expression',
  templateUrl: './division-expression.component.html',
  styleUrl: './division-expression.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe],
})
export class DivisionExpressionComponent extends BaseExpressionComponent {
  readonly left = input.required({ transform: toNumber });
  readonly right = input.required({ transform: toNumber });

  readonly stringValue = input.required<string>();

  public isPunctuationPhrase(): boolean {
    return false;
  }
}
