import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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
  @Input({ transform: toNumber }) left!: number;
  @Input({ transform: toNumber }) right!: number;
}
