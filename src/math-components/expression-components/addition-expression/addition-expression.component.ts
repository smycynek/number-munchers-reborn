import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import {
  BaseExpressionComponent,
  toNumber,
} from '../base-expression/base-expression.component';

@Component({
  selector: 'app-addition-expression',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './addition-expression.component.html',
  styleUrl: './addition-expression.component.less',
})
export class AdditionExpressionComponent extends BaseExpressionComponent {
  readonly left = input.required({ transform: toNumber });
  readonly right = input.required({ transform: toNumber });
}
