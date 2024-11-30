import { Component, input } from '@angular/core';
import { MathExpressionComponent } from '../math-expression/math-expression.component';
import { CommonModule } from '@angular/common';
import { ExpressionData } from '../expression-data/expressionData';

@Component({
  selector: 'app-math-sentence',
  standalone: true,
  imports: [CommonModule, MathExpressionComponent],
  templateUrl: './math-sentence.component.html',
  styleUrl: './math-sentence.component.less',
})
export class MathSentenceComponent {
  public isPunctuationPhrase(value: string) {
    return (
      value.startsWith('.') ||
      value.startsWith(',') ||
      value.startsWith('?') ||
      value.startsWith(')')
    );
  }
  readonly dataArray = input.required<ExpressionData[]>();
}
