import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import {
  BaseExpressionComponent,
  toNumber,
} from '../base-expression/base-expression.component';

@Component({
  selector: 'app-exponent-expression',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exponent-expression.component.html',
  styleUrl: './exponent-expression.component.less',
})
export class ExponentExpressionComponent extends BaseExpressionComponent {
  readonly base = input.required({ transform: toNumber });
  readonly power = input.required({ transform: toNumber });
}
