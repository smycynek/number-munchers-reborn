import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  WritableSignal,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Location, NgClass, NgOptimizedImage } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { DataCell } from './dataCell';
import { debug, hasTouch, parseId, toggleLog } from './utility';

import { HostListener } from '@angular/core';
import { SoundService } from './services/sound.service';
import { PositionService } from './services/position.service';
import JSConfetti from 'js-confetti';
import { StringResources } from './strings';
import {
  debounceTime,
  Observable,
  Subject,
  Subscription,
  takeUntil,
  tap,
  timer,
} from 'rxjs';
import { mertinDelay, mertinInterval } from './constants';
import { ActivatedRoute, Params } from '@angular/router';
import { MathExpressionComponent } from '../math-components/math-expression/math-expression.component';
import { MathSentenceComponent } from '../math-components/math-sentence/math-sentence.component';
import {
  DivisionExpressionName,
  ExpressionData,
  ExpressionTypes,
  MixedNumberExpressionName,
  MultiplicationExpressionName,
  s,
} from '../math-components/expression-data/expressionData';
import { Title } from '@angular/platform-browser';
import { HeartComponent } from '../heart/heart.component';
import { ConfigService } from '../configService';
import {
  allPuzzles,
  PuzzleType,
  PuzzleTypeService,
} from './services/puzzle-type.service';
import { ImageService } from './services/image.service';
import { getRandomPuzzle } from './puzzles/PuzzleBroker';
import { Puzzle } from './puzzles/Puzzle';
import { environment } from '../environments/environment';
import { LocalStorageService } from '../localStorageService';
import { AboutDialogComponent } from '../dialogs/about-dialog/about-dialog.component';
import { GameInfoService } from './services/game-info.service';
import { WelcomeDialogComponent } from '../dialogs/welcome-dialog/welcome-dialog.component';
import { PuzzleTypeDialogComponent } from '../dialogs/puzzle-type-dialog/puzzle-type-dialog.component';

@Component({
  selector: 'app-number-munchers',
  imports: [
    NgClass,
    MathExpressionComponent,
    MathSentenceComponent,
    HeartComponent,
    AboutDialogComponent,
    WelcomeDialogComponent,
    PuzzleTypeDialogComponent,
    NgOptimizedImage,
  ],
  providers: [PositionService, SoundService, PuzzleTypeService, ImageService, GameInfoService],
  templateUrl: './number-munchers.component.html',
  styleUrl: './less/number-munchers.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent
  implements AfterViewChecked, AfterViewInit, OnInit, OnDestroy
{
  public positionService = inject(PositionService);
  public imageService = inject(ImageService);
  public soundService = inject(SoundService);
  public puzzleTypeService = inject(PuzzleTypeService);
  public gameInfoService = inject(GameInfoService);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private titleService = inject(Title);
  private location = inject(Location);
  private configService = inject(ConfigService);
  private localStorageService = inject(LocalStorageService);

  welcomeDialog = viewChild.required<ElementRef>('welcomeDialog'); // welcomeDialog!: ElementRef;
  helpDialog = viewChild.required<ElementRef>('helpDialog');
  puzzleTypeDialog = viewChild.required<ElementRef>('puzzleTypeDialog');
  btnNewGame = viewChild.required<ElementRef>('btnNewGame');
  btnSound = viewChild.required<ElementRef>('btnSound');
  btnMertin = viewChild.required<ElementRef>('btnMertin');
  btnShowPuzzleTypes = viewChild.required<ElementRef>('btnShowPuzzleTypes');
  btnHelp = viewChild.required<ElementRef>('btnHelp');

  private destroyed: Subject<void> = new Subject();

  public holiday: WritableSignal<string> = signal('');

  public readonly cellData: WritableSignal<DataCell[]> = signal([]);
  public readonly statusMessage: WritableSignal<string> = signal(
    StringResources.START,
  );
  public statusMessageDetail: WritableSignal<ExpressionTypes[]> = signal([]);
  public readonly statusMessageClass: WritableSignal<string> =
    signal('status-default');
  public readonly activePuzzle: WritableSignal<Puzzle> = signal(
    getRandomPuzzle(allPuzzles),
  );
  private params: Params = {};

  private timer: Observable<number> = timer(
    mertinDelay * 1000,
    mertinInterval * 1000,
  );
  public speed: WritableSignal<number> = signal(0);

  public readonly highScore: WritableSignal<number> = signal(0);
  public readonly winStreak: WritableSignal<number> = signal(0);
  public readonly showScore: WritableSignal<boolean> = signal(true);

  private timerSubscription: Subscription | undefined;

  constructor(

  ) {
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
  ngOnInit(): void {
    this.holiday.set(this.configService.getConfig().holiday);
    debug('HOLIDAY: ' + this.holiday());
    this.imageService.preload(this.holiday());
    this.init();
    this.timerInit();
    this.route.queryParams
      .pipe(debounceTime(200))
      .subscribe((params: Params) => {
        this.puzzleTypeService.setPuzzleOptions(params['p']);
        this.puzzleTypeService.initialized.set(true);
        this.setSoundOptions(params['s']);
        this.setMertinOptions(params['m']);
        this.reset();
        this.init();
        this.timerInit();
        this.winStreak.set(this.localStorageService.getWinStreak());
        this.highScore.set(this.localStorageService.getHighScore());
        this.params['p'] = params['p'];
        this.params['s'] = params['s'];
        this.params['m'] = params['m'];
        this.titleService.setTitle(
          StringResources.TITLE + environment.titleSuffix,
        );
        this.puzzleTypeService.symbols.set(
          this.puzzleTypeService.getActivePuzzleSymbols(),
        );
        if (
          this.puzzleTypeService.getPuzzleTypes().size !==
          Object.keys(PuzzleType).length / 2
        ) {
          this.titleService.setTitle(
            StringResources.TITLE +
              environment.titleSuffix +
              ' - ' +
              [...this.puzzleTypeService.getPuzzleTypes().values()]
                .map((p) => PuzzleType[p])
                .join(', '),
          );
        }
      });
  }

  /* Init */
  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  ngAfterViewInit() {
    this.welcomeDialog().nativeElement.showModal();
    setInterval(() => this.welcomeDialog().nativeElement.close(), 15000);
  }

  private timerInit(): void {
    this.timerSubscription?.unsubscribe();
    debug('Unsubscribe');
    this.positionService.mertinIndex.set(-1);
    this.timerSubscription = this.timer
      .pipe(
        takeUntil(this.destroyed),
        tap((v) => debug(`Pulse: ${v}`)),
      )
      .subscribe((val: number) => {
        if (this.speed() !== 0 && !this.noRemainingSolutions()) {
          if (val % this.speed() === 0) {
            debug(
              `Reset square event: ${val}, Interval length: ${this.speed() * mertinInterval}`,
            );
            this.positionService.mertinIndex.set(
              this.positionService.getRandomNonOccupiedIndex(),
            );
            this.resetSquare(this.positionService.mertinIndex());
          }
        }
      });
    debug('Subscribe');
  }

  private init(): void {
    if (!this.cellData().length) {
      this.activePuzzle.set(
        getRandomPuzzle(this.puzzleTypeService.getPuzzleTypes()),
      );
      debug(
        `Puzzle: ${PuzzleType[this.activePuzzle().type]}, ${this.activePuzzle().getQuestionText()[0].stringValue}`,
      );
      debug('Set up puzzle data:');
      this.cellData.set([
        ...this.activePuzzle().generateCells(
          this.positionService.columnCount() * this.positionService.rowCount(),
        ),
      ]);

      debug(`Total valid solutions ${this.getTotalValidSolutions()}`);

      debug('--');
      if (this.noRemainingSolutions()) {
        // should not happen
        debug('No solutions', 1);
        debug(this.activePuzzle.name, 1);
        this.statusMessage.set('No solutions, try a new game');
        this.statusMessageDetail.set([s('-')]);
      }
    }
  }

  /* Options */

  /* eslint-disable @typescript-eslint/no-unused-vars */

  public updateUrl(param: string, value: string): void {
    this.location.replaceState('/', this.updateQueryString(param, value));
  }

  private updateQueryString(param: string, value: string): string {
    if (!value || value === '0' || value === 'true' || value === 'undefined') {
      delete this.params[param];
    } else {
      this.params[param] = value;
    }
    if (!this.params['s']) {
      delete this.params['s'];
    }
    if (!this.params['m']) {
      delete this.params['m'];
    }
    if (
      !this.params['p'] ||
      this.puzzleTypeService.getActivePuzzleCodes().length ===
        Object.keys(PuzzleType).length / 2
    ) {
      delete this.params['p'];
    }
    return new URLSearchParams(this.params).toString();
  }

  private setMertinOptions(mertinValue: string) {
    const mertinValueNumber = Number(mertinValue);
    if ([1, 2, 3].includes(mertinValueNumber)) {
      if (this.speed() === 0) {
        this.timerInit();
        this.speed.set(Number(mertinValue));
      }
    }
  }

  public toggleMertin(): void {
    if (this.speed() === 0) {
      this.timerInit();
      this.speed.set(3);
    } else {
      this.speed.set(this.speed() - 1);
    }
    this.updateUrl('m', this.speed() ? this.speed().toString() : '');
    if (this.speed() === 0) {
      this.positionService.mertinIndex.set(-1);
    }
    debug(`Toggle/change interval length: ${this.speed() * mertinInterval}`);
    this.btnMertin().nativeElement.blur();
  }

  public showPuzzleTypes(): void {
    this.btnShowPuzzleTypes().nativeElement.blur();
    this.updateUrl('p', this.puzzleTypeService.getActivePuzzleCodes());
    this.puzzleTypeDialog().nativeElement.showModal();
    debug('Show puzzle types');
  }

  public toggleSound(): void {
    this.soundService.toggleSound();
    debug(`Sound: ${this.soundService.getSoundOn()}`);
    this.updateUrl('s', this.soundService.getSoundOn().toString());
    this.btnSound().nativeElement.blur();
  }

  public toggleDebug(): void {
    const logStatus = toggleLog();
    console.log(`Logging: ${logStatus}`);
  }

  public toggleScore(): void {
    this.showScore.set(!this.showScore());
  }

  /* Game state */

  private reset(): void {
    this.positionService.activeRow.set(0);
    this.positionService.activeColumn.set(0);
    this.positionService.mertinIndex.set(-1);
    this.statusMessage.set(StringResources.START);
    this.statusMessageDetail.set([s(StringResources.YOU_CAN_DO_IT)]);
    this.statusMessageClass.set('status-default');
    this.cellData.set([]);
  }

  public settingsChanged(puzzleCodes: string): void {
    this.updateUrl('p', puzzleCodes);
    this.newGame();
  }
  public newGame(): void {
    debug('New game');
    this.reset();
    this.init();
    this.timerInit();
    this.btnNewGame().nativeElement.blur();
  }

  public getCellData(r: number, c: number): DataCell {
    if (!this.cellData().length) {
      return new DataCell(
        new ExpressionData(0, MixedNumberExpressionName),
        false,
        false,
      );
    }
    return this.cellData()[r * this.positionService.columnCount() + c];
  }

  public getRemainingSolutionsCount(): number {
    if (!this.cellData().length) {
      return 0;
    }
    return this.cellData().filter((cell) => cell.valid && !cell.discovered)
      .length;
  }

  public getTotalValidSolutions(): number {
    if (!this.cellData().length) {
      return 0;
    }
    return this.cellData().filter((cell) => cell.valid).length;
  }

  public noRemainingSolutions(): boolean {
    if (!this.cellData().length) {
      return false;
    }
    const done = this.cellData().every(
      (cell: DataCell) => cell.discovered || !cell.valid,
    );
    return done;
  }

  private perfectScore(): boolean {
    if (!this.cellData().length) {
      return false;
    }
    return this.cellData()
      .filter((cell: DataCell) => cell.discovered)
      .every((cell: DataCell) => cell.valid);
  }

  /* UI State */
  public getMertinButtonClass(): string {
    return 'no-border';
  }

  public isActive(cellRow: number, cellColumn: number): boolean {
    return (
      cellRow == this.positionService.activeRow() &&
      cellColumn == this.positionService.activeColumn()
    );
  }

  public getAvatarSizeClass(idxr: number, idxc: number): string {
    if (
      (this.isActive(idxr, idxc) && this.hasMertin(idxr, idxc)) ||
      this.activePuzzle().type === PuzzleType.Addition ||
      this.activePuzzle().type === PuzzleType.Subtraction ||
      this.activePuzzle().type === PuzzleType.Roots ||
      this.activePuzzle().type === PuzzleType.Decimals
    ) {
      return 'smaller';
    }
    return 'larger';
  }

  public hasMertin(cellRow: number, cellColumn: number): boolean {
    const idx = cellRow * this.positionService.columnCount() + cellColumn;
    return idx == this.positionService.mertinIndex();
  }

  private resetSquare(squareIndex: number): void {
    if (squareIndex < 0) {
      debug('Invalid reset index!');
      return;
    }
    // TODO, ensure new value not duplicate of existing square

    this.soundService.playCackle();
    const solutionsCount = this.getRemainingSolutionsCount();
    debug('--Reset Square--');
    debug(`Index to replace: ${squareIndex}`);
    debug(`Remaining solutions: ${solutionsCount}`);
    debug(
      `Removing: ${this.cellData()[squareIndex].expressionValue.toString()}`,
    );
    let newValue;
    if (solutionsCount <= 1) {
      newValue = this.activePuzzle().getValidSamples(); // insert valid choice
      debug('Adding correct answer:');
    } else {
      newValue = this.activePuzzle().getRandomSamples(1);
      debug('Adding random answer');
    }
    this.cellData.update((data: DataCell[]) => {
      data[squareIndex] = this.activePuzzle().generateCell(newValue);
      return data;
    });
    debug('---');
  }

  public getAvatarImage(): string {
    const data = this.getCellData(
      this.positionService.activeRow(),
      this.positionService.activeColumn(),
    );
    if (data.valid && data.discovered)
      return this.imageService.getMunchyHappyImage(this.holiday());
    else if (!data.valid && data.discovered) {
      return this.imageService.getMunchySadImage(this.holiday());
    } else {
      return this.imageService.getMunchyNeutralImage(this.holiday());
    }
  }

  public getGeneralInstructions(): string {
    if (hasTouch()) {
      return StringResources.TAP_SQUARES;
    } else {
      return StringResources.KEYBOARD;
    }
  }

  public getStartButtonText(): string {
    let text = StringResources.NEW_GAME;
    if (this.noRemainingSolutions()) {
      text = StringResources.TRY_AGAIN;
    }
    return text;
  }

  public getCellClass(cellRow: number, cellColumn: number): string {
    let classes = '';
    const cell: DataCell = this.getCellData(cellRow, cellColumn);
    if (this.hasMertin(cellRow, cellColumn)) {
      classes = 'mertin-flip';
    }
    if (!cell) {
      classes = 'status-default';
    }
    if (cell.discovered && cell.valid) {
      classes = 'discovered-valid';
    }
    if (cell.discovered && !cell.valid) {
      classes = 'discovered-invalid';
    }
    if (
      cellRow == this.positionService.activeRow() &&
      cellColumn == this.positionService.activeColumn()
    ) {
      classes += ' cell-active';
    }
    if (this.noRemainingSolutions()) {
      classes += ' game-over';
    }
    const typeToShrink = [MultiplicationExpressionName, DivisionExpressionName];
    if (
      typeToShrink.includes(cell.expressionValue.opType) &&
      (this.hasMertin(cellRow, cellColumn) ||
        this.isActive(cellRow, cellColumn))
    ) {
      classes += ' cell-smaller';
    }
    return classes;
  }

  /* Mouse and Keyboard */
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key == 'ArrowUp') {
      this.positionService.down();
    } else if (event.key == 'ArrowDown') {
      this.positionService.up();
    } else if (event.key === 'ArrowLeft') {
      this.positionService.left();
    } else if (event.key === 'ArrowRight') {
      this.positionService.right();
    } else if (event.key === ' ') {
      this.choiceAction();
    } else if (event.key.toUpperCase() === 'N') {
      this.newGame();
    }
  }

  private getClickTarget(event: UIEvent | null): HTMLElement | null {
    if (event && event.target) {
      let current: HTMLElement | null = <HTMLElement>event.target;
      while (current != null) {
        if (current.classList.contains('click-target')) {
          return current;
        } else {
          current = current.parentElement;
        }
      }
    }
    return null;
  }

  @HostListener('document:click', ['$event'])
  handleClickEvent(event: UIEvent) {
    debug('---document:click---');
    // debug("touch event? " + (('touches' in event)));
    // debug("mouse event? " + (event instanceof PointerEvent));
    // debug("device has touch? " + hasTouch());
    // debug("---");
    if (hasTouch() || 'touches' in event) {
      debug('Skipping mouse event if touch event.');
      return;
    }
    // debug(`TouchOrClick: ${event}`);
    if (this.noRemainingSolutions()) {
      return;
    }
    this.handleClickOrTouchEvent(event);
  }

  @HostListener('document:touchstart', ['$event'])
  handleTouchEvent(event: UIEvent) {
    debug('---document:touch---');
    // debug("touch event? " + ('touches' in event));
    // debug("mouse event? " + (event instanceof PointerEvent));
    // debug("device has touch? " + hasTouch());
    // debug("---");
    if (!hasTouch() || event instanceof PointerEvent) {
      debug('Skipping touch event if pointer event.');
      return;
    }
    // debug(`TouchOrClick: ${event}`);
    if (this.noRemainingSolutions()) {
      return;
    }
    this.handleClickOrTouchEvent(event);
  }

  private handleClickOrTouchEvent(event: UIEvent) {
    if (this.noRemainingSolutions()) {
      return;
    }
    let rowColumn: number[] = [];
    const parentTarget = this.getClickTarget(event);
    if (!parentTarget) {
      return;
    }
    try {
      rowColumn = parseId(parentTarget.id);
    } catch (err) {
      return;
    }
    this.positionService.activeRow.set(rowColumn[0]);
    this.positionService.activeColumn.set(rowColumn[1]);
    this.choiceAction();
  }

  /* Action */
  public choiceAction(): void {
    if (this.noRemainingSolutions()) {
      return;
    }
    debug(`Choice: ${this.positionService.getPosition()}`);
    const data = this.getCellData(
      this.positionService.activeRow(),
      this.positionService.activeColumn(),
    );
    data.discovered = true;
    if (data.valid) {
      if (this.noRemainingSolutions()) {
        this.executeGameOver(data);
        return;
      }
      this.executeCorrect(data);
    } else {
      this.executeIncorrect(data);
    }
    debug(`Correct? ${data.valid}, ${data.expressionValue.toString()}`);
  }

  private executeGameOver(data: DataCell): void {
    debug('Game Over');
    this.statusMessageClass.set('status-success');
    this.statusMessage.set(StringResources.FOUND_ALL);
    this.statusMessageDetail.set(
      this.activePuzzle().successDetails(data.expressionValue.clone()),
    );
    if (this.perfectScore()) {
      this.executePerfectScore();
    } else {
      this.soundService.playWhoo();
    }
  }

  private executePerfectScore(): void {
    this.soundService.playWhooAndPerfectScore();
    this.statusMessage.set(StringResources.PERFECT_SCORE);
    debug(StringResources.PERFECT_SCORE);
    const jsConfetti = new JSConfetti();
    jsConfetti.addConfetti();
    this.winStreak.set(this.winStreak() + 1);
    this.localStorageService.setWinStreak(this.winStreak());
    if (this.winStreak() > this.highScore()) {
      this.highScore.set(this.winStreak());
      this.localStorageService.setHighScore(this.winStreak());
    }
  }

  private executeCorrect(data: DataCell): void {
    this.soundService.playYum();
    this.statusMessage.set(StringResources.CORRECT);
    this.statusMessageDetail.set(
      this.activePuzzle().successDetails(data.expressionValue.clone()),
    );
    this.statusMessageClass.set('status-success');
  }

  private executeIncorrect(data: DataCell): void {
    this.soundService.playYuck();
    this.winStreak.set(0);
    this.localStorageService.setWinStreak(0);
    this.statusMessage.set(StringResources.INCORRECT);
    this.statusMessageDetail.set(
      this.activePuzzle().errorDetails(data.expressionValue.clone()),
    );
    this.statusMessageClass.set('status-error');
  }

  /* Sound */
  private setSoundOptions(soundOptionsString: string) {
    if (soundOptionsString?.toLowerCase() === 'false') {
      this.soundService.toggleSound();
    }
  }

  /* Other */

  public showHelp(): void {
    this.btnHelp().nativeElement.blur();
    this.helpDialog().nativeElement.showModal();
    debug('Show help');
  }
}
