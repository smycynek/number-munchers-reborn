import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-base-expression',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './base-expression.component.html',
  styleUrl: './base-expression.component.less',
})
export class BaseExpressionComponent {

  readonly value = input.required({ transform: toNumber });
  showRval = input<boolean>();
  displayOp = input<string>();
  displayRval = input<number>();
}

export function toNumber(value: string): number {
  return Number(value);
}

export function toExpression(value: string): number {
  return Number(value);
}
