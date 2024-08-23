import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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
  @Input({ transform: toNumber }) coefficient!: number;
  @Input({ transform: toNumber }) index!: number;
  @Input({ transform: toNumber }) radicand!: number;
}
