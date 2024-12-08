import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from '../number-munchers.component';
import { RouterTestingModule } from '@angular/router/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PuzzleType } from '../services/puzzle-type.service';
import { SoundService } from '../services/sound.service';

describe('NumberMuncherComponent', () => {
  let component: AppComponent;
  // let componentRef: ComponentRef<AppComponent>;
  let fixture: ComponentFixture<AppComponent>;
  let soundServiceMock: jasmine.SpyObj<SoundService>;

  beforeEach(() => {
    soundServiceMock = jasmine.createSpyObj('SoundService', [
      'playYuck',
      'playYum',
      'playWhoo',
      'getSoundOn',
      'playPerfectScore',
      'playWhooAndPerfectScore',
    ]);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [{ provide: SoundService, useValue: soundServiceMock }],
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
    soundServiceMock.playYuck.and.returnValue();
    soundServiceMock.playYum.and.returnValue();
    soundServiceMock.playWhoo.and.returnValue();
    soundServiceMock.playPerfectScore.and.returnValue();
    soundServiceMock.playWhooAndPerfectScore.and.returnValue();
    soundServiceMock.getSoundOn.and.returnValue(true);
    expect(component.activePuzzle().type).toEqual(PuzzleType.Addition);
    component.ngOnInit();
    component.newGame();

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
