import { Component, input } from '@angular/core';
import { BaseExpressionComponent } from '../base-expression/base-expression.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-string-expression',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './string-expression.component.html',
  styleUrl: './string-expression.component.less',
})
export class StringExpressionComponent extends BaseExpressionComponent {
  readonly stringValue = input.required<string>();

  public isPunctuationPhrase() {
    return (
      this.stringValue().startsWith('.') ||
      this.stringValue().startsWith(',') ||
      this.stringValue().startsWith('?')
    );
  }
}
