import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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
  @Input({ transform: toNumber }) left!: number;
  @Input({ transform: toNumber }) right!: number;
}
