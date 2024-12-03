import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { MixedNumberExpressionData } from '../../math-components/expression-data/expressionData';
import { MathExpressionComponent } from '../../math-components/math-expression/math-expression.component';

describe('MathExpressionComponent', () => {
  let component: MathExpressionComponent;
  let componentRef: ComponentRef<MathExpressionComponent>;
  let fixture: ComponentFixture<MathExpressionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MathExpressionComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    const mixedNumber = new MixedNumberExpressionData(2, 1, 2);
    componentRef.setInput('mathData', mixedNumber);
    fixture.detectChanges();
  });

  it('should create a valid mixed number', () => {
    expect(component).toBeTruthy();
    expect(component.mathData().value).toEqual(2.5);
  });
});
