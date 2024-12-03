import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MixedNumberExpressionComponent } from '../../math-components/expression-components/mixed-number-expression/mixed-number-expression.component';
import { ComponentRef } from '@angular/core';
import { MixedNumberExpressionName } from '../../math-components/expression-data/expressionData';

describe('MixedNumberExpressionComponent', () => {
  let component: MixedNumberExpressionComponent;
  let componentRef: ComponentRef<MixedNumberExpressionComponent>;
  let fixture: ComponentFixture<MixedNumberExpressionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MixedNumberExpressionComponent);

    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('whole', 5);
    componentRef.setInput('numerator', 1);
    componentRef.setInput('denominator', 2);
    componentRef.setInput('value', 5.5);
    componentRef.setInput('opType', MixedNumberExpressionName);
    fixture.detectChanges();
  });

  it('should create a valid mixed number', () => {
    expect(component).toBeTruthy();
    expect(component.value()).toEqual(5.5);
  });
});
