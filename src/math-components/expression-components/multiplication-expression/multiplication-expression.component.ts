import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import {
  BaseExpressionComponent,
  toNumber,
} from '../base-expression/base-expression.component';

@Component({
  selector: 'app-multiplication-expression',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './multiplication-expression.component.html',
  styleUrl: './multiplication-expression.component.less',
})
export class MultiplicationExpressionComponent extends BaseExpressionComponent {
  readonly left = input.required({ transform: toNumber });
  readonly right = input.required({ transform: toNumber });
}
