import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MathSentenceComponent } from './math-sentence.component';

describe('MathSentenceComponent', () => {
  let component: MathSentenceComponent;
  let fixture: ComponentFixture<MathSentenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MathSentenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MathSentenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
