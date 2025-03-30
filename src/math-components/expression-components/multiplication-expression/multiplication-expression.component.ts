import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  BaseExpressionComponent,
  toNumber,
} from '../base-expression/base-expression.component';

@Component({
  selector: 'app-multiplication-expression',
  templateUrl: './multiplication-expression.component.html',
  styleUrl: './multiplication-expression.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiplicationExpressionComponent extends BaseExpressionComponent {
  readonly left = input.required({ transform: toNumber });
  readonly right = input.required({ transform: toNumber });
}
