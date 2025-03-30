import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  BaseExpressionComponent,
  toNumber,
} from '../base-expression/base-expression.component';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-root-expression',
  templateUrl: './root-expression.component.html',
  styleUrl: './root-expression.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe]
})
export class RootExpressionComponent extends BaseExpressionComponent {
  readonly coefficient = input.required({ transform: toNumber });
  readonly index = input.required({ transform: toNumber });
  readonly radicand = input.required({ transform: toNumber });
}
