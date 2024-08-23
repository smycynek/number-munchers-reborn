import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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
  @Input({ transform: toNumber }) coefficient!: number;
  @Input({ transform: toNumber }) base!: number;
  @Input({ transform: toNumber }) argument!: number;
}
