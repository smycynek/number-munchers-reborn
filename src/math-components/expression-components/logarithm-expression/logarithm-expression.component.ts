import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import {
  BaseExpressionComponent,
  toNumber,
} from '../base-expression/base-expression.component';

@Component({
  selector: 'app-logarithm-expression',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logarithm-expression.component.html',
  styleUrl: './logarithm-expression.component.less',
})
export class LogarithmExpressionComponent extends BaseExpressionComponent {
  readonly coefficient = input.required({ transform: toNumber });
  readonly base = input.required({ transform: toNumber });
  readonly argument = input.required({ transform: toNumber });
}
