import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from '../number-munchers.component';

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { PuzzleType } from '../services/puzzle-type.service';
import { RouterModule } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

describe('NumberMuncherComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
      imports: [
        RouterModule.forRoot([
          { path: '', component: AppComponent },
          { path: 'simple', component: AppComponent },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    // componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('Should create a number munchers component, have correct initial data, and play a game', () => {
    expect(component).toBeTruthy();
    expect(component.getRemainingSolutionsCount()).toBeGreaterThan(0);
    expect(component.activePuzzle().name).toBeDefined();
    expect(component.highScore()).toEqual(0);
    expect(component.winStreak()).toEqual(0);
    expect(component.cellData().length).toEqual(12);
    component.puzzleTypeService.delete(PuzzleType.Subtraction);
    component.puzzleTypeService.delete(PuzzleType.Multiplication);
    component.puzzleTypeService.delete(PuzzleType.Division);
    component.puzzleTypeService.delete(PuzzleType.Fractions);
    component.puzzleTypeService.delete(PuzzleType.Miscellaneous);
    component.puzzleTypeService.delete(PuzzleType.Roots);
    component.puzzleTypeService.delete(PuzzleType.Exponents);
    component.puzzleTypeService.delete(PuzzleType.Greater_or_less_than);
    component.puzzleTypeService.delete(PuzzleType.Percentages);
    component.puzzleTypeService.delete(PuzzleType.Decimals);
    component.newGame();
    expect(component.activePuzzle().type).toEqual(PuzzleType.Addition);
    component.ngOnInit();
    component.newGame();
    component.toggleSound();
    for (let c = 0; c < 5; c++) {
      for (let r = 0; r < 4; r++) {
        component.choiceAction();
        component.positionService.right();
        component.choiceAction();
      }
      component.positionService.up();
    }

    expect(component.getRemainingSolutionsCount()).toEqual(0);
  });
});
