import { AfterViewChecked, Component } from '@angular/core';
import { CommonModule } from '@angular/common'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChangeDetectorRef } from '@angular/core';
import { DataCell, ValuePair } from './dataCell';
import { Puzzle, PuzzleType } from './puzzle';
import { debug, hasTouch, parseId, toggleLog, wrapDown, wrapUp } from './utility';
import { HostListener } from '@angular/core';
import { SoundManager } from './soundManager';
import { PositionManager } from './positionManager';
import JSConfetti from 'js-confetti';
import { StringResources } from './strings';
import { Observable, timer } from 'rxjs';
import { getRandomItemFromSetAndRemove } from './sampleRandomValues';
import { mertinDelay, mertinInterval } from './constants';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

const allPuzzles = new Set<PuzzleType>([
  PuzzleType.MISC,
  PuzzleType.DIVISION,
  PuzzleType.GREATER_LESS_THAN,
  PuzzleType.MULTIPLICATION,
]);

@Component({
  selector: 'app-number-munchers',
  standalone: true,
  imports: [CommonModule, NgbModule, RouterOutlet, FormsModule],
  templateUrl: './numberMunchers.component.html',
  styleUrl: './numberMunchers.component.less'
})

export class AppComponent implements AfterViewChecked {
  private puzzleTypes = allPuzzles;
  private cellData: DataCell[] = [];
  private statusMessage = StringResources.START;
  private statusMessageDetail = StringResources.YOU_CAN_DO_IT;
  private statusMessageClass = 'status-default';
  private activePuzzle: Puzzle = Puzzle.getRandomPuzzle(this.puzzleTypes);
  private foundNumbers: Set<string> = new Set<string>();
  private soundManager: SoundManager = new SoundManager();
  private positionManager: PositionManager = new PositionManager();
  public title: string = StringResources.TITLE;
  private timer: Observable<number> = timer(mertinDelay * 1000, mertinInterval * 1000);
  private speed: number = 0;

  public multiplication: boolean = true;
  public glt: boolean = true;
  public division: boolean = true;
  public misc: boolean = true;

  public get puzzleType(): typeof PuzzleType {
    return PuzzleType;
  }

  constructor(private cdr: ChangeDetectorRef, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
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

  private timerInit(): void {
    this.positionManager.setMertinIndex(-1);
    this.timer.subscribe((val) => {
      if (this.speed !== 0 && !this.noRemainingSolutions()) {
        if ((val % this.speed) === 0) {
          debug(`Timer pulse: ${val} speed: ${this.speed}`);
          this.positionManager.setMertinIndex(this.getRandomNonOccupiedIndex());
          this.resetSquare(this.positionManager.getMertinIndex())
        }
      }
    });
  }

  private init() {
    if (!this.cellData.length) {
      this.activePuzzle = Puzzle.getRandomPuzzle(this.puzzleTypes);
      debug(`Puzzle: ${this.activePuzzle.questionText}`);
      debug('Set up puzzle data:')
      this.cellData = [...this.activePuzzle.generateCells(this.positionManager.getColumnCount() * this.positionManager.getRowCount())];
      debug('--');
      if (this.noRemainingSolutions()) { // should not happen
        this.statusMessage = 'No solutions, try a new game';
        this.statusMessageDetail = '-';
      }
    }
  }

/* Options */
  public isCheckboxDisabled(val: boolean) {
    if (val && this.puzzleTypes.size <= 1)
      return true;
    else
      return false;
  }

  public toggleType(value: boolean, type: PuzzleType) {
    if (value) {
      this.puzzleTypes.add(type);
    } else {
      this.puzzleTypes.delete(type);
    }
  }

  public cycleSpeed(): void {
    if (this.speed === 0) {
      this.speed = 3;
    } else {
      this.speed--;
    }
    if (this.speed === 0) {
      this.positionManager.setMertinIndex(-1);
    }
    debug(`Speed: ${this.speed}`);
  }

  /* Game state */

  private reset() {
    this.positionManager.setActiveRow(0);
    this.positionManager.setActiveColumn(0);
    this.statusMessage = StringResources.START;
    this.statusMessageDetail = StringResources.YOU_CAN_DO_IT;
    this.statusMessageClass = 'status-default';
    this.cellData = [];
    this.foundNumbers = new Set<string>();
  }

  public newGame() {
    debug('New game');
    document.getElementById('btnNewGame')?.blur();
    this.reset();
    this.init();
  }

  private getRandomNonOccupiedIndex(): number {
    const activeIndex = (this.positionManager.getActiveRow() * this.positionManager.getColumnCount())
      + this.positionManager.getActiveColumn();
    const upperBound = this.positionManager.getColumnCount() * this.positionManager.getRowCount();
    const base = [...[].constructor(upperBound).keys()]
    const baseSet = new Set(base);
    baseSet.delete(activeIndex);
    baseSet.delete(this.positionManager.getMertinIndex());
    return getRandomItemFromSetAndRemove(baseSet);
  }

  public getCellData(r: number, c: number): DataCell {
    if (!this.cellData.length) {
      return new DataCell(new ValuePair(0, '0'), false, false);
    }
    return this.cellData[(r * this.positionManager.getColumnCount()) + c];
  }

  public getRemainingSolutionsCount(): number {
    if (!this.cellData.length) {
      return 0;
    }
    return this.cellData.filter(cell => cell.valid && !cell.discovered).length
  }

  public noRemainingSolutions(): boolean {
    if (!this.cellData.length) {
      return false;
    }
    const done = this.cellData.every((cell: DataCell) => cell.discovered || !cell.valid);
    return done;
  }

  private perfectScore(): boolean {
    if (!this.cellData.length) {
      return false;
    }
    return this.cellData.filter((cell: DataCell) => cell.discovered).every((cell: DataCell) => (cell.valid));
  }

  /* UI State */
  public getMertinButtonClass(): string {
    return 'no-border';
  }

  public isActive(cellRow: number, cellColumn: number): boolean {
    return (cellRow == this.positionManager.getActiveRow() && cellColumn == this.positionManager.getActiveColumn());
  }


  public getAvatarSizeClass(idxr: number, idxc: number): string {
    if (this.isActive(idxr, idxc) && this.hasMertin(idxr, idxc)) {
      return 'double';
    }
    return 'single';
  }

  public hasMertin(cellRow: number, cellColumn: number): boolean {
    const idx = (cellRow * this.positionManager.getColumnCount()) + cellColumn;
    return idx == this.positionManager.getMertinIndex();
  }

  private resetSquare(squareIndex: number) {
    if (squareIndex < 0) {
      debug('Invalid reset index!');
      return;
    }
    this.soundManager.playCackle();
    const solutionsCount = this.getRemainingSolutionsCount();
    debug('--Reset Square--')
    debug(`Index to replace: ${squareIndex}`);
    debug(`Remaining solutions: ${solutionsCount}`);
    let newValues;
    if (solutionsCount <= 1) {
      debug('Adding correct answer');
      newValues = this.activePuzzle.getValidSamples(); // insert valid choice
    } else {
      debug('Adding random answer')
      newValues = this.activePuzzle.getRandomSamples(1, this.activePuzzle.maxValue);
    }
    this.cellData[squareIndex] = this.activePuzzle.generateCell(newValues);
    debug('---');
  }

  public getMertinImage(): string {
    return 'assets/mertin.png';
  }

  public getMertinButtonImage(): string {
    return `assets/mertin-${this.speed}.png`;
  }
  public getAvatarImage(): string {
    const data = this.getCellData(this.positionManager.getActiveRow(), this.positionManager.getActiveColumn());
    if (data.valid && data.discovered)
      return 'assets/muncher-happy.png';
    else if (!data.valid && data.discovered) {
      return 'assets/muncher-sad.png';
    }
    else {
      return 'assets/muncher-neutral.png';
    }
  }

  public getGeneralInstructions(): string {
    if (hasTouch()) {
      return StringResources.TAP_SQUARES;
    }
    else {
      return StringResources.KEYBOARD;
    }
  }

  public getStartButtonText(): string {
    let text = StringResources.NEW_GAME;
    if (this.noRemainingSolutions()) {
      text = StringResources.TRY_AGAIN;
    }
    if (!hasTouch()) {
      text = `${text} ${StringResources.N_KEY}`;
    }
    return text;
  }

  public getQuestionPrompt(): string {
    return this.activePuzzle?.questionText;
  }

  public getStatusMessage(): string {
    return this.statusMessage;
  }

  public getStatusDetailMessage(): string {
    return this.statusMessageDetail;
  }

  public getStatusMessageClass(): string {
    return this.statusMessageClass;
  }

  public getFoundNumbers(): string {
    return `${StringResources.FOUND} ${[...this.foundNumbers].join(', ')}`;
  }

  public getStartButtonClass(): string {
    const done = this.noRemainingSolutions() ? 'btn-success button-success' : 'btn-primary';
    return done;
  }

  public getCellClass(cellRow: number, cellColumn: number): string {
    let classes = '';

    const cell: DataCell = this.getCellData(cellRow, cellColumn);

    if (this.hasMertin(cellRow, cellColumn)) {
      classes = 'mertin-flip'
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
    if (cellRow == this.positionManager.getActiveRow() && cellColumn == this.positionManager.getActiveColumn()) {
      classes += ' cell-active';
    }
    if (this.noRemainingSolutions()) {
      classes += ' game-over';
    }
    if (cell.valuePair.valueAsString.includes('x')) {
      classes += ' smaller'
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

  @HostListener('document:click', ['$event'])
  handleClickEvent(event: UIEvent) {
    debug('---document:click---');
    // debug("touch event? " + (('touches' in event)));
    // debug("mouse event? " + (event instanceof PointerEvent));
    // debug("device has touch? " + hasTouch());
    // debug("---");
    if (hasTouch() || ('touches' in event)) {
      debug('Skipping mouse event if touch event.')
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
      debug('Skipping touch event if pointer event.')
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
    try {
      rowColumn = parseId((<HTMLElement>(event.target)).id);
    } catch (err) {
      return;
    }
    this.positionManager.setActiveRow(rowColumn[0]);
    this.positionManager.setActiveColumn(rowColumn[1]);
    this.choiceAction();
  }

  private up() {
    this.positionManager.setActiveRow(wrapUp(this.positionManager.getActiveRow(), this.positionManager.getRowCount()));
    debug(this.positionManager.getActiveRow() + ', ' + this.positionManager.getActiveColumn());
  }

  private down() {
    this.positionManager.setActiveRow(wrapDown(this.positionManager.getActiveRow(), this.positionManager.getRowCount()));
    debug(this.positionManager.getActiveRow() + ', ' + this.positionManager.getActiveColumn());
  }

  private left() {
    this.positionManager.setActiveColumn(wrapDown(this.positionManager.getActiveColumn(), this.positionManager.getColumnCount()));
    debug(this.positionManager.getActiveRow() + ', ' + this.positionManager.getActiveColumn());
  }

  private right() {
    this.positionManager.setActiveColumn(wrapUp(this.positionManager.getActiveColumn(), this.positionManager.getColumnCount()));
    debug(this.positionManager.getActiveRow() + ', ' + this.positionManager.getActiveColumn());
  }

  /* Action */
  private choiceAction(): void {
    if (this.noRemainingSolutions()) {
      return;
    }
    debug(this.positionManager.getActiveRow() + ', ' + this.positionManager.getActiveColumn());
    const data = this.getCellData(this.positionManager.getActiveRow(), this.positionManager.getActiveColumn());
    data.discovered = true;

    if (data.valid) {
      this.foundNumbers.add(data.valuePair.valueAsString);
      if (this.noRemainingSolutions()) {
        debug('Game Over');
        this.statusMessageClass = 'status-success';
        this.statusMessage = StringResources.FOUND_ALL;
        this.statusMessageDetail = this.activePuzzle.successDetails(data.valuePair);
        if (this.perfectScore()) {
          this.soundManager.playWhooAndPerfectScore();
          this.statusMessage = `${this.statusMessage} ${StringResources.PERFECT_SCORE}`;
          debug(StringResources.PERFECT_SCORE);
          const jsConfetti = new JSConfetti();
          jsConfetti.addConfetti();
        } else {
          this.soundManager.playWhoo();
        }
        return;
      }
      this.soundManager.playYum();
      this.statusMessage = `${StringResources.CORRECT} ${data.valuePair.valueAsString} ${StringResources.IS} ${this.activePuzzle.responseText}`;
      this.statusMessageDetail = this.activePuzzle.successDetails(data.valuePair);
      this.statusMessageClass = 'status-success';

    } else {
      this.soundManager.playYuck();
      this.statusMessage = `${StringResources.SORRY} ${data.valuePair.valueAsString} ${StringResources.IS} ${StringResources.NOT} ${this.activePuzzle.responseText}`;
      this.statusMessageDetail = this.activePuzzle.errorDetails(data.valuePair);
      this.statusMessageClass = 'status-error';
    }

    debug(`Correct? ${data.valid}, ${data.valuePair.toString()}, Question: ${this.activePuzzle.questionText}`)
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
    document.getElementById('btnSound')?.blur();
    debug(`Sound: ${this.soundManager.getSoundOn()}`);
  }

  public toggleDebug(): void {
    const logStatus = toggleLog();
    debug(`Logging: ${logStatus}`);
  }

}
