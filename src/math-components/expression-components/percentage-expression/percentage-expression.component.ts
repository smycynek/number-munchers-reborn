import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  BaseExpressionComponent,
  toNumber,
} from '../base-expression/base-expression.component';

@Component({
  selector: 'app-percentage-expression',
  imports: [CommonModule],
  templateUrl: './percentage-expression.component.html',
  styleUrl: './percentage-expression.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PercentageExpressionComponent extends BaseExpressionComponent {
  readonly percentageValue = input.required({ transform: toNumber });
}
