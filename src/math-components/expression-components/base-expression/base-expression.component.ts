import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-base-expression',
  templateUrl: './base-expression.component.html',
  styleUrl: './base-expression.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseExpressionComponent {
  readonly value = input.required({ transform: toNumber });
  readonly opType = input.required<string>();
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
