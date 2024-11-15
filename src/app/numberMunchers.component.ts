import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  WritableSignal,
  signal,
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChangeDetectorRef } from '@angular/core';
import { DataCell } from './dataCell';
import { debug, getRandomItemFromSetAndRemove, hasTouch, parseId, toggleLog } from './utility';

import { HostListener } from '@angular/core';
import { SoundManager } from './managers/soundManager';
import { PositionManager } from './managers/positionManager';
import JSConfetti from 'js-confetti';
import { StringResources } from './strings';
import { Observable, Subscription, timer } from 'rxjs';
import { mertinDelay, mertinInterval } from './constants';
import { ActivatedRoute, Params, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
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
import { version } from './version';
import { Title } from '@angular/platform-browser';
import { HeartComponent } from '../heart/heart.component';
import { ConfigService } from '../configService';
import {
  allPuzzles,
  puzzleCodes,
  puzzleSymbols,
  PuzzleType,
  PuzzleTypeManager,
} from './managers/puzzleTypeManager';
import { ImageManager } from './managers/imageManager';
import { getRandomPuzzle } from './puzzles/PuzzleBroker';
import { Puzzle } from './puzzles/Puzzle';

@Component({
  selector: 'app-number-munchers',
  standalone: true,
  imports: [
    CommonModule,
    NgbModule,
    RouterOutlet,
    FormsModule,
    MathExpressionComponent,
    MathSentenceComponent,
    HeartComponent,
  ],
  templateUrl: './numberMunchers.component.html',
  styleUrl: './less/numberMunchers.component.less',
})
export class AppComponent implements AfterViewChecked, AfterViewInit {
  @ViewChild('welcomeDialog') welcomeDialog!: ElementRef;
  @ViewChild('helpDialog') helpDialog!: ElementRef;
  @ViewChild('puzzleTypeDialog') puzzleTypeDialog!: ElementRef;
  @ViewChild('btnNewGame') btnNewGame!: ElementRef;
  @ViewChild('btnSound') btnSound!: ElementRef;
  @ViewChild('btnMertin') btnMertin!: ElementRef;
  @ViewChild('btnShowPuzzleTypes') btnShowPuzzleTypes!: ElementRef;
  @ViewChild('btnHelp') btnHelp!: ElementRef;
  public holiday: WritableSignal<string> = signal('');
  public symbols: WritableSignal<string> = signal('');

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
  private soundManager: SoundManager = new SoundManager();
  private positionManager: PositionManager = new PositionManager();
  public imageManager: ImageManager = new ImageManager();
  public title: WritableSignal<string> = signal(StringResources.TITLE);

  private settingsChanged: WritableSignal<boolean> = signal(false);

  private timer: Observable<number> = timer(
    mertinDelay * 1000,
    mertinInterval * 1000,
  );
  public speed: WritableSignal<number> = signal(0);
  public puzzleTypeManager: PuzzleTypeManager = new PuzzleTypeManager();

  public readonly highScore: WritableSignal<number> = signal(0);
  public readonly winStreak: WritableSignal<number> = signal(0);
  public readonly showScore: WritableSignal<boolean> = signal(true);

  private timerSubscription: Subscription | undefined;
  public get puzzleType(): typeof PuzzleType {
    return PuzzleType;
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private titleService: Title,
    private location: Location,
    private configService: ConfigService,
  ) {
    this.holiday.set(this.configService.getConfig().holiday);
    debug('HOLIDAY: ' + this.holiday());
    this.imageManager.preload(this.holiday());
    this.init();
    this.timerInit();
    this.route.queryParams.subscribe((params: Params) => {
      this.setPuzzleOptions(params['p']);
      this.setSoundOptions(params['s']);
      this.setMertinOptions(params['m']);
      this.reset();
      this.init();
      this.timerInit();
      this.params['p'] = params['p'];
      this.params['s'] = params['s'];
      this.params['m'] = params['m'];

      this.symbols.set(this.getActivePuzzleSymbols());
      if (
        this.puzzleTypeManager.getPuzzleTypes().size !==
        Object.keys(PuzzleType).length / 2
      ) {
        this.titleService.setTitle(
          'Number Munchers Reborn - ' +
            [...this.puzzleTypeManager.getPuzzleTypes().values()]
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
    this.welcomeDialog.nativeElement.showModal();
    setInterval(() => this.welcomeDialog.nativeElement.close(), 15000);
  }

  private timerInit(): void {
    this.timerSubscription?.unsubscribe();
    debug('Unsubscribe');
    this.positionManager.mertinIndex.set(-1);
    this.timerSubscription = this.timer.subscribe((val) => {
      debug(`Pulse: ${val}`);
      if (this.speed() !== 0 && !this.noRemainingSolutions()) {
        if (val % this.speed() === 0) {
          debug(
            `Reset square event: ${val}, Interval length: ${this.speed() * mertinInterval}`,
          );
          this.positionManager.mertinIndex.set(
            this.getRandomNonOccupiedIndex(),
          );
          this.resetSquare(this.positionManager.mertinIndex());
        }
      }
    });
    debug('Subscribe');
  }

  private init() {
    if (!this.cellData().length) {
      this.activePuzzle.set(
        getRandomPuzzle(this.puzzleTypeManager.getPuzzleTypes()),
      );
      debug(
        `Puzzle: ${PuzzleType[this.activePuzzle().type]}, ${this.activePuzzle().getQuestionText()[0].stringValue}`,
      );
      debug('Set up puzzle data:');
      this.cellData.set([
        ...this.activePuzzle().generateCells(
          this.positionManager.columnCount() * this.positionManager.rowCount(),
        ),
      ]);

      debug(`Total valid solutions ${this.getTotalValidSolutions()}`);

      debug('--');
      if (this.noRemainingSolutions()) {
        // should not happen
        debug('No solutions', 1);
        debug(this.activePuzzle.name), 1;
        this.statusMessage.set('No solutions, try a new game');
        this.statusMessageDetail.set([s('-')]);
      }
    }
  }

  /* Options */
  public isCheckboxDisabled(val: boolean) {
    if (val && this.puzzleTypeManager.getPuzzleTypes().size <= 1) return true;
    else return false;
  }

  private getActivePuzzleSymbols(): string {
    return `(Puzzles: ${[...this.puzzleTypeManager.getPuzzleTypes().values()].map((p) => puzzleSymbols.get(p)).join('')})`;
  }

  private getActivePuzzleCodes(): string {
    const codes: string[] = [
      ...this.puzzleTypeManager.getPuzzleTypes().values(),
    ].map((p) => puzzleCodes.get(p) ?? '');
    return codes.sort((a, b) => a.localeCompare(b)).join('');
  }

  public toggleType(value: boolean, type: PuzzleType, updateQuery?: boolean) {
    this.settingsChanged.set(true);
    if (value) {
      debug(`Add: ${PuzzleType[type]}`);
      this.puzzleTypeManager.add(type);
    } else {
      debug(`Remove: ${PuzzleType[type]}`);
      this.puzzleTypeManager.delete(type);
    }

    if (updateQuery) {
      let activeTypeCodes = this.getActivePuzzleCodes();
      if (
        this.puzzleTypeManager.getPuzzleTypes().size ===
        Object.keys(PuzzleType).length / 2
      ) {
        activeTypeCodes = '';
      }
      this.symbols.set(this.getActivePuzzleSymbols());
      this.titleService.setTitle(
        'Number Munchers Reborn - ' +
          [...this.puzzleTypeManager.getPuzzleTypes().values()]
            .map((p) => PuzzleType[p])
            .join(', '),
      );
      this.updateUrl('p', activeTypeCodes);
    }
  }

  private updateUrl(param: string, value: string): void {
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
    if (!this.params['p']) {
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
      this.positionManager.mertinIndex.set(-1);
    }
    debug(`Toggle/change interval length: ${this.speed() * mertinInterval}`);
    this.btnMertin.nativeElement.blur();
  }

  private setPuzzleOptions(puzzleString: string) {
    const puzzleStringLc = puzzleString?.toLowerCase();
    if (
      !puzzleStringLc ||
      puzzleStringLc.search('/|m|a|s|d|e|f|o|g|r|/') === -1
    ) {
      return;
    }
    this.toggleType(puzzleStringLc.includes('m'), PuzzleType.Multiplication);
    this.toggleType(puzzleStringLc.includes('a'), PuzzleType.Addition);
    this.toggleType(puzzleStringLc.includes('s'), PuzzleType.Subtraction);
    this.toggleType(puzzleStringLc.includes('d'), PuzzleType.Division);
    this.toggleType(puzzleStringLc.includes('e'), PuzzleType.Exponents);
    this.toggleType(puzzleStringLc.includes('f'), PuzzleType.Fractions);
    this.toggleType(puzzleStringLc.includes('o'), PuzzleType.Miscellaneous);
    this.toggleType(
      puzzleStringLc.includes('g'),
      PuzzleType.Greater_or_less_than,
    );
    this.toggleType(puzzleStringLc.includes('r'), PuzzleType.Roots);
  }

  public showPuzzleTypes(): void {
    this.btnShowPuzzleTypes.nativeElement.blur();
    this.puzzleTypeDialog.nativeElement.showModal();
    console.log('Show puzzle types');
  }

  public toggleSound(): void {
    this.soundManager.toggleSound();
    debug(`Sound: ${this.soundManager.getSoundOn()}`);
    this.updateUrl('s', this.soundManager.getSoundOn().toString());
    this.btnSound.nativeElement.blur();
  }

  public toggleDebug(): void {
    const logStatus = toggleLog();
    console.log(`Logging: ${logStatus}`);
  }

  public toggleScore(): void {
    this.showScore.set(!this.showScore());
  }

  /* Game state */

  private reset() {
    this.positionManager.activeRow.set(0);
    this.positionManager.activeColumn.set(0);
    this.positionManager.mertinIndex.set(-1);
    this.statusMessage.set(StringResources.START);
    this.statusMessageDetail.set([s(StringResources.YOU_CAN_DO_IT)]);
    this.statusMessageClass.set('status-default');
    this.cellData.set([]);
  }

  public closeSettings() {
    if (this.settingsChanged()) {
      this.newGame();
      this.settingsChanged.set(false);
    }
  }

  public newGame() {
    debug('New game');
    this.reset();
    this.init();
    this.timerInit();
    this.btnNewGame.nativeElement.blur();
  }

  private getRandomNonOccupiedIndex(): number {
    const activeIndex =
      this.positionManager.activeRow() * this.positionManager.columnCount() +
      this.positionManager.activeColumn();
    const upperBound =
      this.positionManager.columnCount() * this.positionManager.rowCount();
    const base = [...[].constructor(upperBound).keys()];
    const baseSet = new Set(base);
    baseSet.delete(activeIndex);
    baseSet.delete(this.positionManager.mertinIndex());
    return getRandomItemFromSetAndRemove(baseSet);
  }

  public getCellData(r: number, c: number): DataCell {
    if (!this.cellData().length) {
      return new DataCell(
        new ExpressionData(0, MixedNumberExpressionName),
        false,
        false,
      );
    }
    return this.cellData()[r * this.positionManager.columnCount() + c];
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
      cellRow == this.positionManager.activeRow() &&
      cellColumn == this.positionManager.activeColumn()
    );
  }

  public getAvatarSizeClass(idxr: number, idxc: number): string {
    if (
      (this.isActive(idxr, idxc) && this.hasMertin(idxr, idxc)) ||
      this.activePuzzle().type === PuzzleType.Addition ||
      this.activePuzzle().type === PuzzleType.Subtraction ||
      this.activePuzzle().type === PuzzleType.Roots
    ) {
      return 'double';
    }
    return 'single';
  }

  public hasMertin(cellRow: number, cellColumn: number): boolean {
    const idx = cellRow * this.positionManager.columnCount() + cellColumn;
    return idx == this.positionManager.mertinIndex();
  }

  private resetSquare(squareIndex: number) {
    if (squareIndex < 0) {
      debug('Invalid reset index!');
      return;
    }
    // TODO, ensure new value not duplicate of existing square

    this.soundManager.playCackle();
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
      this.positionManager.activeRow(),
      this.positionManager.activeColumn(),
    );
    if (data.valid && data.discovered)
      return this.imageManager.getMunchyHappyImage(this.holiday());
    else if (!data.valid && data.discovered) {
      return this.imageManager.getMunchySadImage();
    } else {
      return this.imageManager.getMunchyNeutralImage();
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
      cellRow == this.positionManager.activeRow() &&
      cellColumn == this.positionManager.activeColumn()
    ) {
      classes += ' cell-active';
    }
    if (this.noRemainingSolutions()) {
      classes += ' game-over';
    }

    // SVM TOOD
    if (
      (cell.expressionValue.opType === MultiplicationExpressionName ||
        cell.expressionValue.opType === DivisionExpressionName) &&
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
      this.positionManager.down();
    } else if (event.key == 'ArrowDown') {
      this.positionManager.up();
    } else if (event.key === 'ArrowLeft') {
      this.positionManager.left();
    } else if (event.key === 'ArrowRight') {
      this.positionManager.right();
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
    this.handleClockOrTouchEvent(event);
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
    this.handleClockOrTouchEvent(event);
  }

  private handleClockOrTouchEvent(event: UIEvent) {
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
    this.positionManager.activeRow.set(rowColumn[0]);
    this.positionManager.activeColumn.set(rowColumn[1]);
    this.choiceAction();
  }

  /* Action */
  private choiceAction(): void {
    if (this.noRemainingSolutions()) {
      return;
    }
    debug(`Choice: ${this.positionManager.getPosition()}`);
    const data = this.getCellData(
      this.positionManager.activeRow(),
      this.positionManager.activeColumn(),
    );
    data.discovered = true;

    if (data.valid) {
      if (this.noRemainingSolutions()) {
        debug('Game Over');
        this.statusMessageClass.set('status-success');
        this.statusMessage.set(StringResources.FOUND_ALL);
        this.statusMessageDetail.set(
          this.activePuzzle().successDetails(data.expressionValue.clone()),
        );
        if (this.perfectScore()) {
          this.soundManager.playWhooAndPerfectScore();
          this.statusMessage.set(StringResources.PERFECT_SCORE);
          debug(StringResources.PERFECT_SCORE);
          const jsConfetti = new JSConfetti();
          jsConfetti.addConfetti();
          this.winStreak.set(this.winStreak() + 1);
          if (this.winStreak() > this.highScore()) {
            this.highScore.set(this.winStreak());
          }
        } else {
          this.soundManager.playWhoo();
        }
        return;
      }
      this.soundManager.playYum();
      this.statusMessage.set(StringResources.CORRECT);
      this.statusMessageDetail.set(
        this.activePuzzle().successDetails(data.expressionValue.clone()),
      );
      this.statusMessageClass.set('status-success');
    } else {
      this.soundManager.playYuck();
      this.winStreak.set(0);
      this.statusMessage.set(StringResources.INCORRECT);
      this.statusMessageDetail.set(
        this.activePuzzle().errorDetails(data.expressionValue.clone()),
      );
      this.statusMessageClass.set('status-error');
    }

    debug(`Correct? ${data.valid}, ${data.expressionValue.toString()}`);
  }

  /* Position */
  public getPositionManager(): PositionManager {
    return this.positionManager;
  }

  /* Sound */
  private setSoundOptions(soundOptionsString: string) {
    if (soundOptionsString?.toLowerCase() === 'false') {
      this.soundManager.toggleSound();
    }
  }

  public getSoundManager(): SoundManager {
    return this.soundManager;
  }

  /* Other */
  public getVersion(): number {
    return version;
  }

  public showHelp(): void {
    this.btnHelp.nativeElement.blur();
    this.helpDialog.nativeElement.showModal();
    console.log('Show help');
  }
}
