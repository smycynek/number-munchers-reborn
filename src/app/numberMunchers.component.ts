import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  WritableSignal,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChangeDetectorRef } from '@angular/core';
import { DataCell } from './dataCell';
import { Puzzle, PuzzleType } from './puzzle';
import {
  debug,
  hasTouch,
  parseId,
  toggleLog,
  wrapDown,
  wrapUp,
} from './utility';
import { HostListener } from '@angular/core';
import { SoundManager } from './soundManager';
import { PositionManager } from './positionManager';
import JSConfetti from 'js-confetti';
import { StringResources } from './strings';
import { Observable, Subscription, timer } from 'rxjs';
import { getRandomItemFromSetAndRemove } from './sampleRandomValues';
import { mertinDelay, mertinInterval } from './constants';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
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

const allPuzzles = new Set<PuzzleType>([
  PuzzleType.MISC,
  PuzzleType.MULTIPLICATION,
  PuzzleType.FRACTIONS,
  PuzzleType.DIVISION,
  PuzzleType.GREATER_LESS_THAN,
  PuzzleType.ADDITION,
  PuzzleType.SUBTRACTION
]);

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

  private puzzleTypes = allPuzzles;
  public readonly cellData: WritableSignal<DataCell[]> = signal([]);
  public readonly statusMessage: WritableSignal<string> = signal(
    StringResources.START,
  );
  public statusMessageDetail: ExpressionTypes[] = [];
  public readonly statusMessageClass: WritableSignal<string> =
    signal('status-default');
  public readonly activePuzzle: WritableSignal<Puzzle> = signal(
    Puzzle.getRandomPuzzle(this.puzzleTypes),
  );
  private soundManager: SoundManager = new SoundManager();
  private positionManager: PositionManager = new PositionManager();
  public title: string = StringResources.TITLE;

  private timer: Observable<number> = timer(
    mertinDelay * 1000,
    mertinInterval * 1000,
  );
  private speed: number = 0;

  public multiplication: boolean = true;
  public glt: boolean = true;
  public division: boolean = true;
  public misc: boolean = true;
  public fractions: boolean = true;
  public addition: boolean = true;
  public subtraction: boolean = true;

  private timerSubscription: Subscription | undefined;
  public get puzzleType(): typeof PuzzleType {
    return PuzzleType;
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {
    this.route.queryParams.subscribe((params) => {
      debug(params.toString());
    });
    this.puzzleTypes = allPuzzles;
    this.timerInit();
    this.init();
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
      if (this.speed !== 0 && !this.noRemainingSolutions()) {
        if (val % this.speed === 0) {
          debug(
            `Reset square event: ${val}, Interval length: ${this.speed * mertinInterval}`,
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
      this.activePuzzle.set(Puzzle.getRandomPuzzle(this.puzzleTypes));
      debug(`Puzzle: ${this.activePuzzle().questionText}`);
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
        this.statusMessage.set('No solutions, try a new game');
        this.statusMessageDetail = [s('-')];
      }
    }
  }

  /* Options */
  public isCheckboxDisabled(val: boolean) {
    if (val && this.puzzleTypes.size <= 1) return true;
    else return false;
  }

  public toggleType(value: boolean, type: PuzzleType) {
    if (value) {
      debug(`Add: ${PuzzleType[type]}`);
      this.puzzleTypes.add(type);
    } else {
      debug(`Remove: ${PuzzleType[type]}`);
      this.puzzleTypes.delete(type);
    }
  }

  /* Game state */

  private reset() {
    this.positionManager.activeRow.set(0);
    this.positionManager.activeColumn.set(0);
    this.positionManager.mertinIndex.set(-1);
    this.statusMessage.set(StringResources.START);
    this.statusMessageDetail = [s(StringResources.YOU_CAN_DO_IT)];
    this.statusMessageClass.set('status-default');
    this.cellData.set([]);
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
    if (this.isActive(idxr, idxc) && this.hasMertin(idxr, idxc) || this.activePuzzle().type === PuzzleType.ADDITION || this.activePuzzle().type === PuzzleType.SUBTRACTION) {
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
      newValue = this.activePuzzle().getRandomSamples(
        1,
        this.activePuzzle().maxValue,
      );
      debug('Adding random answer');
    }
    this.cellData.update((data: DataCell[]) => {
      data[squareIndex] = this.activePuzzle().generateCell(newValue);
      return data;
    });
    debug('---');
  }

  public getMertinImage(): string {
    return 'assets/mertin.png';
  }

  public getMertinButtonImage(): string {
    return `assets/mertin-${this.speed}.png`;
  }
  public getAvatarImage(): string {
    const data = this.getCellData(
      this.positionManager.activeRow(),
      this.positionManager.activeColumn(),
    );
    if (data.valid && data.discovered) return 'assets/muncher-happy.png';
    else if (!data.valid && data.discovered) {
      return 'assets/muncher-sad.png';
    } else {
      return 'assets/muncher-neutral.png';
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
      this.down();
    } else if (event.key == 'ArrowDown') {
      this.up();
    } else if (event.key === 'ArrowLeft') {
      this.left();
    } else if (event.key === 'ArrowRight') {
      this.right();
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

  private getPosition(): string {
    return `${this.positionManager.activeRow()}, ${this.positionManager.activeColumn()}`;
  }

  private up() {
    this.positionManager.activeRow.set(
      wrapUp(this.positionManager.activeRow(), this.positionManager.rowCount()),
    );
    debug(`Up: ${this.getPosition()}`);
  }

  private down() {
    this.positionManager.activeRow.set(
      wrapDown(
        this.positionManager.activeRow(),
        this.positionManager.rowCount(),
      ),
    );
    debug(`Down: ${this.getPosition()}`);
  }

  private left() {
    this.positionManager.activeColumn.set(
      wrapDown(
        this.positionManager.activeColumn(),
        this.positionManager.columnCount(),
      ),
    );
    debug(`Left: ${this.getPosition()}`);
  }

  private right() {
    this.positionManager.activeColumn.set(
      wrapUp(
        this.positionManager.activeColumn(),
        this.positionManager.columnCount(),
      ),
    );
    debug(`Right: ${this.getPosition()}`);
  }

  /* Action */
  private choiceAction(): void {
    if (this.noRemainingSolutions()) {
      return;
    }
    debug(`Choice: ${this.getPosition()}`);
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
        this.statusMessageDetail = this.activePuzzle().successDetails(
          data.expressionValue.clone(),
        );
        if (this.perfectScore()) {
          this.soundManager.playWhooAndPerfectScore();
          this.statusMessage.set(StringResources.PERFECT_SCORE);
          debug(StringResources.PERFECT_SCORE);
          const jsConfetti = new JSConfetti();
          jsConfetti.addConfetti();
        } else {
          this.soundManager.playWhoo();
        }
        return;
      }
      this.soundManager.playYum();
      this.statusMessage.set(StringResources.CORRECT);
      this.statusMessageDetail = this.activePuzzle().successDetails(
        data.expressionValue.clone(),
      );
      this.statusMessageClass.set('status-success');
    } else {
      this.soundManager.playYuck();
      this.statusMessage.set(StringResources.INCORRECT);
      this.statusMessageDetail = this.activePuzzle().errorDetails(
        data.expressionValue.clone(),
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
  public getSoundManager(): SoundManager {
    return this.soundManager;
  }

  public toggleSound(): void {
    this.soundManager.toggleSound();
    debug(`Sound: ${this.soundManager.getSoundOn()}`);
    this.btnSound.nativeElement.blur();
  }

  public toggleMertin(): void {
    if (this.speed === 0) {
      this.timerInit();
      this.speed = 3;
    } else {
      this.speed--;
    }
    if (this.speed === 0) {
      this.positionManager.mertinIndex.set(-1);
    }
    debug(`Toggle/change interval length: ${this.speed * mertinInterval}`);
    this.btnMertin.nativeElement.blur();
  }

  public showPuzzleTypes(): void {
    this.btnShowPuzzleTypes.nativeElement.blur();
    this.puzzleTypeDialog.nativeElement.showModal();
    console.log('Show puzzle types');
  }

  public showHelp(): void {
    this.btnHelp.nativeElement.blur();
    this.helpDialog.nativeElement.showModal();
    console.log('Show help');
  }

  public toggleDebug(): void {
    const logStatus = toggleLog();
    console.log(`Logging: ${logStatus}`);
  }
}
