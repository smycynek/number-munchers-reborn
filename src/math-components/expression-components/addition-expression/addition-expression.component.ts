import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BaseExpressionComponent, toNumber } from '../base-expression/base-expression.component';

@Component({
  selector: 'app-addition-expression',
  templateUrl: './addition-expression.component.html',
  styleUrl: './addition-expression.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdditionExpressionComponent extends BaseExpressionComponent {
  readonly left = input.required({ transform: toNumber });
  readonly right = input.required({ transform: toNumber });

  readonly stringValue = input.required<string>();

  public isPunctuationPhrase(): boolean {
    return false;
  }
}
