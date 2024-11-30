import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import {
  BaseExpressionComponent,
  toNumber,
} from '../base-expression/base-expression.component';

@Component({
  selector: 'app-root-expression',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './root-expression.component.html',
  styleUrl: './root-expression.component.less',
})
export class RootExpressionComponent extends BaseExpressionComponent {
  readonly coefficient = input.required({ transform: toNumber });
  readonly index = input.required({ transform: toNumber });
  readonly radicand = input.required({ transform: toNumber });
}
