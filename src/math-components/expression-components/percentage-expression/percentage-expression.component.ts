import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import {
  BaseExpressionComponent,
  toNumber,
} from '../base-expression/base-expression.component';

@Component({
  selector: 'app-percentage-expression',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './percentage-expression.component.html',
  styleUrl: './percentage-expression.component.less',
})
export class PercentageExpressionComponent extends BaseExpressionComponent {
  readonly percentageValue = input.required({ transform: toNumber });
}
