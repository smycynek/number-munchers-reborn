import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  BaseExpressionComponent,
  toNumber,
} from '../base-expression/base-expression.component';

@Component({
  selector: 'app-logarithm-expression',
  imports: [CommonModule],
  templateUrl: './logarithm-expression.component.html',
  styleUrl: './logarithm-expression.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogarithmExpressionComponent extends BaseExpressionComponent {
  readonly coefficient = input.required({ transform: toNumber });
  readonly base = input.required({ transform: toNumber });
  readonly argument = input.required({ transform: toNumber });
}
