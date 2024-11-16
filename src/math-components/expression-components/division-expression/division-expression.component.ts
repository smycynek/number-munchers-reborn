import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import {
  BaseExpressionComponent,
  toNumber,
} from '../base-expression/base-expression.component';

@Component({
  selector: 'app-division-expression',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './division-expression.component.html',
  styleUrl: './division-expression.component.less',
})
export class DivisionExpressionComponent extends BaseExpressionComponent {
  readonly left = input.required({ transform: toNumber });
  readonly right = input.required({ transform: toNumber });
}
