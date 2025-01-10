import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BaseExpressionComponent } from '../base-expression/base-expression.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-string-expression',
  imports: [CommonModule],
  templateUrl: './string-expression.component.html',
  styleUrl: './string-expression.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
