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

@Component({
  selector: 'app-number-munchers',
  standalone: true,
  imports: [CommonModule, NgbModule],
  templateUrl: './numberMunchers.component.html',
  styleUrl: './numberMunchers.component.less'
})
export class AppComponent implements AfterViewChecked {
  private cellData: DataCell[] = [];
  private statusMessage = StringResources.START;
  private statusMessageDetail = StringResources.YOU_CAN_DO_IT;
  private statusMessageClass = "status-default";
  private activePuzzle: Puzzle = Puzzle.getRandomPuzzle();
  private foundNumbers: Set<number> = new Set<number>();
  private soundManager: SoundManager = new SoundManager();
  private positionManager: PositionManager = new PositionManager();
  public title: string = StringResources.TITLE;
  constructor(private cdr: ChangeDetectorRef) {
  }

  /* Init */
  ngAfterViewChecked() {
    this.init();
    this.cdr.detectChanges();
  }

  private reset() {
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
        console.log("No solutions");
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

  @HostListener('document:touchstart', ['$event'])
  // @HostListener('document:click', ['$event'])
  handleClickOrTouchEvent(event: UIEvent) {
    debug("touch? " + (event instanceof TouchEvent));
    debug("mouse? " + (event instanceof PointerEvent));
    debug("hasTouch? " + hasTouch());
    debug("---");
    if (hasTouch() && (event instanceof PointerEvent)) {
      debug('Skipping mouse event if touch enabled.')
      return;
    } else {
      debug("Continuing with touch or mouse event");
    }
    debug(`TouchClick: ${event}`);
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
