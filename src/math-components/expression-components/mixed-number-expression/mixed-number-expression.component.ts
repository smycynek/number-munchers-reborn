import { Component, Input } from '@angular/core';
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
  @Input({ transform: toNumber }) whole!: number;
  @Input({ transform: toNumber }) numerator!: number;
  @Input({ transform: toNumber }) denominator!: number;
}
