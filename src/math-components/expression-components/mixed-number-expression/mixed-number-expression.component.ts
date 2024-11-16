import { Component, input } from '@angular/core';
import {
  BaseExpressionComponent,
  toNumber,
} from '../base-expression/base-expression.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mixed-number-expression',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mixed-number-expression.component.html',
  styleUrl: './mixed-number-expression.component.less',
})
export class MixedNumberExpressionComponent extends BaseExpressionComponent {
  readonly whole = input.required({ transform: toNumber });
  readonly numerator = input.required({ transform: toNumber });
  readonly denominator = input.required({ transform: toNumber });
}
