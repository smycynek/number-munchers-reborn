import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import {
  BaseExpressionComponent,
  toNumber,
} from '../base-expression/base-expression.component';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-decimal-expression',
  imports: [CommonModule],
  templateUrl: './decimal-expression.component.html',
  styleUrl: './decimal-expression.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DecimalExpressionComponent extends BaseExpressionComponent {
  readonly decimalValue = input.required({ transform: toNumber });
}
