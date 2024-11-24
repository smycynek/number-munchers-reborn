import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import {
  BaseExpressionComponent,
  toNumber,
} from '../base-expression/base-expression.component';

@Component({
  selector: 'app-decimal-expression',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './decimal-expression.component.html',
  styleUrl: './decimal-expression.component.less',
})
export class DecimalExpressionComponent extends BaseExpressionComponent {
  readonly decimalValue = input.required({ transform: toNumber });
}
