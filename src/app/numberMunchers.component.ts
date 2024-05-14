import { AfterViewChecked, Component } from '@angular/core';
import { CommonModule } from '@angular/common'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChangeDetectorRef } from '@angular/core';
import { DataCell } from './dataCell';
import { Puzzle } from './puzzle';
import { debug, hasTouch, parseId, toggleLog, wrapDown, wrapUp } from './utility';
import { HostListener } from '@angular/core';
import { SoundManager } from './soundManager';
import { PositionManager } from './positionManager';
import JSConfetti from 'js-confetti';
import { StringResources } from './strings';
import { Observable, Subject, takeUntil, timer } from 'rxjs';
import { getRandomItemFromSetAndRemove } from './sampleRandomValues';
import { mertinDelay, mertinInterval } from './constants';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-number-munchers',
  standalone: true,
  imports: [CommonModule, NgbModule, RouterOutlet],
  templateUrl: './numberMunchers.component.html',
  styleUrl: './numberMunchers.component.less'
})
export class AppComponent implements AfterViewChecked {
  private mertin: boolean = false;
  private cellData: DataCell[] = [];
  private statusMessage = StringResources.START;
  private statusMessageDetail = StringResources.YOU_CAN_DO_IT;
  private statusMessageClass = "status-default";
  private activePuzzle: Puzzle = Puzzle.getRandomPuzzle();
  private foundNumbers: Set<number> = new Set<number>();
  private soundManager: SoundManager = new SoundManager();
  private positionManager: PositionManager = new PositionManager();
  public title: string = StringResources.TITLE;
  private timer: Observable<number> = timer(mertinDelay * 1000, mertinInterval * 1000);
  private interval: number = 1;
  private pauseNotify: Subject<boolean> = new Subject();
  public hasInterval(): boolean {
    return (this.interval > 0);
  }
  constructor(private cdr: ChangeDetectorRef, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params['t']) {
        this.interval = Number(params['t']);
        this.timer = timer(mertinDelay * 1000, this.interval * 1000);
      }
    });

    this.timerInit();
  }

  /* Init */
  ngAfterViewChecked() {
    this.init();
    this.cdr.detectChanges();
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

  public getMertinButtonClass(): string {
    return "no-border";
  }

  private setMertin(value: boolean): void {
    this.mertin = value;
    if (!this.mertin) {
      this.positionManager.setMertinIndex(-1);
      this.pauseNotify.next(true);
    }
    else {
      this.timerInit();
    }

  }
  public toggleMertin(): void {
    this.setMertin(!this.mertin);
  }

  private timerInit(): void {
    this.positionManager.setMertinIndex(-1);
    this.pauseNotify.next(true);
    this.timer.pipe(takeUntil(this.pauseNotify)).subscribe(() => {
      if (this.mertin && !this.noRemainingSolutions()) {
        this.positionManager.setMertinIndex(this.getRandomNonOccupiedIndex());
        this.resetSquare(this.positionManager.getMertinIndex())
        if (this.noRemainingSolutions()) {
          this.pauseNotify.next(true);
        }
      }
    });
  }

  private reset() {
    this.timerInit();
    this.positionManager.setActiveRow(0);
    this.positionManager.setActiveColumn(0);
    this.statusMessage = StringResources.START;
    this.statusMessageDetail = StringResources.YOU_CAN_DO_IT;
    this.statusMessageClass = "status-default";
    this.cellData = [];
    this.foundNumbers = new Set<number>();
  }

  private init() {
    if (!this.cellData.length) {
      this.activePuzzle = Puzzle.getRandomPuzzle();
      this.cellData = [...this.activePuzzle.generateCells(this.positionManager.getColumnCount() * this.positionManager.getRowCount())];
      if (this.noRemainingSolutions()) { // should not happen
        this.statusMessage = "No solutions, try a new game";
        this.statusMessageDetail = "-";
      }
    }
  }

  public newGame() {
    document.getElementById("btnNewGame")?.blur();
    this.reset();
    this.init();
  }

  public getCellData(r: number, c: number): DataCell {
    if (!this.cellData.length) {
      return new DataCell(0, false, false);
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
  public isActive(cellRow: number, cellColumn: number): boolean {
    return (cellRow == this.positionManager.getActiveRow() && cellColumn == this.positionManager.getActiveColumn());
  }


  public getAvatarSizeClass(idxr: number, idxc: number): string {
    if (this.isActive(idxr, idxc) && this.hasMertin(idxr, idxc)) {
      return "double";
    }
    return "single";
  }

  public hasMertin(cellRow: number, cellColumn: number): boolean {
    const idx = (cellRow * this.positionManager.getColumnCount()) + cellColumn;
    return idx == this.positionManager.getMertinIndex();
  }

  private resetSquare(squareIndex: number) {
    this.soundManager.playCackle();
    const solutionsCount = this.getRemainingSolutionsCount();
    debug(`Index to replace: ${squareIndex}`);
    debug(`Remaining solutions: ${solutionsCount}`);
    let newValues;
    if (solutionsCount <= 1) {
      newValues = this.activePuzzle.getValidSamples(); // insert valid choice
    } else {
      newValues = this.activePuzzle.getCuratedValues(1, false);  // insert random choice
    }
    this.cellData[squareIndex] = this.activePuzzle.generateCell(newValues);
  }

  public getMertinImage(): string {
    return "assets/mertin.png";
  }

  public getMertinButtonImage(): string {
    if (this.mertin) {
      return "assets/mertin.png";
    }
    else return "assets/no-mertin.png";
  }
  public getAvatarImage(): string {
    const data = this.getCellData(this.positionManager.getActiveRow(), this.positionManager.getActiveColumn());
    if (data.valid && data.discovered)
      return "assets/muncher-happy.png";
    else if (!data.valid && data.discovered) {
      return "assets/muncher-sad.png";
    }
    else {
      return "assets/muncher-neutral.png";
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
    return `${StringResources.FOUND} ${[...this.foundNumbers].join(", ")}`;
  }

  public getStartButtonClass(): string {
    const done = this.noRemainingSolutions() ? "btn-success button-success" : "btn-primary";
    return done;
  }

  public getCellClass(cellRow: number, cellColumn: number): string {
    let classes = "";
    const cell: DataCell = this.getCellData(cellRow, cellColumn);
    if (this.hasMertin(cellRow, cellColumn)) {
      classes = "mertin-flip"
    }
    if (!cell) {
      classes = "status-default";
    }
    if (cell.discovered && cell.valid) {
      classes = "discovered-valid";
    }
    if (cell.discovered && !cell.valid) {
      classes = "discovered-invalid";
    }
    if (cellRow == this.positionManager.getActiveRow() && cellColumn == this.positionManager.getActiveColumn()) {
      classes += " cell-active";
    }
    if (this.noRemainingSolutions()) {
      classes += " game-over";
    }
    return classes;
  }

  /* Mouse and Keyboard */
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key == "ArrowUp") {
      this.down();
    } else if (event.key == "ArrowDown") {
      this.up();
    } else if (event.key === "ArrowLeft") {
      this.left();
    } else if (event.key === "ArrowRight") {
      this.right();
    } else if (event.key === " ") {
      this.choiceAction();
    } else if (event.key.toUpperCase() === "N") {
      this.newGame();
    }
  }

  @HostListener('document:click', ['$event'])
  handleClickEvent(event: UIEvent) {
    debug("---document:click---");
    debug("touch event? " + (('touches' in event)));
    debug("mouse event? " + (event instanceof PointerEvent));
    debug("device has touch? " + hasTouch());
    debug("---");
    if (hasTouch() || ('touches' in event)) {
      debug('Skipping mouse event if touch event.')
      return;
    }
    debug(`TouchOrClick: ${event}`);
    if (this.noRemainingSolutions()) {
      return;
    }
    this.handleClockOrTouchEvent(event);
  }

  @HostListener('document:touchstart', ['$event'])
  handleTouchEvent(event: UIEvent) {
    debug("---document:touch---");
    debug("touch event? " + ('touches' in event));
    debug("mouse event? " + (event instanceof PointerEvent));
    debug("device has touch? " + hasTouch());
    debug("---");
    if (!hasTouch() || event instanceof PointerEvent) {
      debug('Skipping touch event if pointer event.')
      return;
    }
    debug(`TouchOrClick: ${event}`);
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
    debug(this.positionManager.getActiveRow() + ", " + this.positionManager.getActiveColumn());
  }

  private down() {
    this.positionManager.setActiveRow(wrapDown(this.positionManager.getActiveRow(), this.positionManager.getRowCount()));
    debug(this.positionManager.getActiveRow() + ", " + this.positionManager.getActiveColumn());
  }

  private left() {
    this.positionManager.setActiveColumn(wrapDown(this.positionManager.getActiveColumn(), this.positionManager.getColumnCount()));
    debug(this.positionManager.getActiveRow() + ", " + this.positionManager.getActiveColumn());
  }

  private right() {
    this.positionManager.setActiveColumn(wrapUp(this.positionManager.getActiveColumn(), this.positionManager.getColumnCount()));
    debug(this.positionManager.getActiveRow() + ", " + this.positionManager.getActiveColumn());
  }

  /* Action */
  private choiceAction(): void {
    if (this.noRemainingSolutions()) {
      return;
    }
    debug(this.positionManager.getActiveRow() + ", " + this.positionManager.getActiveColumn());
    const data = this.getCellData(this.positionManager.getActiveRow(), this.positionManager.getActiveColumn());
    data.discovered = true;

    if (data.valid) {
      this.foundNumbers.add(data.value);
      if (this.noRemainingSolutions()) {
        this.statusMessageClass = "status-success";
        this.statusMessage = StringResources.FOUND_ALL;
        this.statusMessageDetail = this.activePuzzle.successDetails(data.value);
        if (this.perfectScore()) {
          this.soundManager.playWhooAndPerfectScore();
          this.statusMessage = `${this.statusMessage} ${StringResources.PERFECT_SCORE}`;
          const jsConfetti = new JSConfetti();
          jsConfetti.addConfetti();
        } else {
          this.soundManager.playWhoo();
        }
        return;
      }
      this.soundManager.playYum();
      this.statusMessage = `${StringResources.CORRECT} ${data.value} ${StringResources.IS} ${this.activePuzzle.responseText}`;
      this.statusMessageDetail = this.activePuzzle.successDetails(data.value);
      this.statusMessageClass = "status-success";

    } else {
      this.soundManager.playYuck();
      this.statusMessage = `${StringResources.SORRY} ${data.value} ${StringResources.IS} ${StringResources.NOT} ${this.activePuzzle.responseText}`;
      this.statusMessageDetail = this.activePuzzle.errorDetails(data.value);
      this.statusMessageClass = "status-error";
    }

    debug(`Correct? ${data.valid}, Value: ${data.value}, Question: ${this.activePuzzle.questionText}`)
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
    document.getElementById("btnSound")?.blur();
  }

  public toggleDebug(): void {
    toggleLog();
  }
}
