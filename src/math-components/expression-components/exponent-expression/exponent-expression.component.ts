import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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
  @Input({ transform: toNumber }) base!: number;
  @Input({ transform: toNumber }) power!: number;
}
