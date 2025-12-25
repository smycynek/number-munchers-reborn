import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BaseExpressionComponent } from '../base-expression/base-expression.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-string-expression',
  templateUrl: './string-expression.component.html',
  styleUrl: './string-expression.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass],
})
export class StringExpressionComponent extends BaseExpressionComponent {
  readonly stringValue = input.required<string>();

  public isPunctuationPhrase(): boolean {
    return (
      this.stringValue().startsWith('.') ||
      this.stringValue().startsWith(',') ||
      this.stringValue().startsWith('?')
    );
  }
}
