import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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
  @Input({ transform: toNumber }) left!: number;
  @Input({ transform: toNumber }) right!: number;
}
