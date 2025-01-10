import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  BaseExpressionComponent,
  toNumber,
} from '../base-expression/base-expression.component';

@Component({
  selector: 'app-division-expression',
  imports: [CommonModule],
  templateUrl: './division-expression.component.html',
  styleUrl: './division-expression.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DivisionExpressionComponent extends BaseExpressionComponent {
  readonly left = input.required({ transform: toNumber });
  readonly right = input.required({ transform: toNumber });
}
