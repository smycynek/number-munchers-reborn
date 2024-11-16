import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import {
  BaseExpressionComponent,
  toNumber,
} from '../base-expression/base-expression.component';

@Component({
  selector: 'app-subtraction-expression',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subtraction-expression.component.html',
  styleUrl: './subtraction-expression.component.less',
})
export class SubtractionExpressionComponent extends BaseExpressionComponent {
  readonly left = input.required({ transform: toNumber });
  readonly right = input.required({ transform: toNumber });
}
