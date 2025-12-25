import { Component, input } from '@angular/core';
import { BaseExpressionComponent, toNumber } from '../base-expression/base-expression.component';
import { ChangeDetectionStrategy } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-decimal-expression',
  templateUrl: './decimal-expression.component.html',
  styleUrl: './decimal-expression.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe],
})
export class DecimalExpressionComponent extends BaseExpressionComponent {
  readonly decimalValue = input.required({ transform: toNumber });

  readonly stringValue = input.required<string>();

  public isPunctuationPhrase(): boolean {
    return false;
  }
}
