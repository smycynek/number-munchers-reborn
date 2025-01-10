import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  BaseExpressionComponent,
  toNumber,
} from '../base-expression/base-expression.component';

@Component({
  selector: 'app-exponent-expression',
  imports: [CommonModule],
  templateUrl: './exponent-expression.component.html',
  styleUrl: './exponent-expression.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExponentExpressionComponent extends BaseExpressionComponent {
  readonly base = input.required({ transform: toNumber });
  readonly power = input.required({ transform: toNumber });
}
