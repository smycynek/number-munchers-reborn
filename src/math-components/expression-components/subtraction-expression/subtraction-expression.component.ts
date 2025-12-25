import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BaseExpressionComponent, toNumber } from '../base-expression/base-expression.component';

@Component({
  selector: 'app-subtraction-expression',
  templateUrl: './subtraction-expression.component.html',
  styleUrl: './subtraction-expression.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubtractionExpressionComponent extends BaseExpressionComponent {
  readonly left = input.required({ transform: toNumber });
  readonly right = input.required({ transform: toNumber });

  readonly stringValue = input.required<string>();

  public isPunctuationPhrase(): boolean {
    return false;
  }
}
