import { AfterViewChecked, Component } from '@angular/core';
import { CommonModule } from '@angular/common'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChangeDetectorRef } from '@angular/core';
import { DataCell } from './dataCell';
import { Puzzle } from './puzzle';
import { getUniqueCollection, parseId, wrapDown, wrapUp } from './utility';
import { HostListener } from '@angular/core';
import { SoundManager } from './soundManager';
import { PositionManager } from './positionManager';

@Component({
  selector: 'app-number-munchers',
  standalone: true,
  imports: [CommonModule, NgbModule],
  templateUrl: './numberMunchers.component.html',
  styleUrl: './numberMunchers.component.less'
})
export class AppComponent implements AfterViewChecked {
  private cellData: DataCell[] = [];
  private statusMessage = "Start!";
  private statusMessageClass = "default";
  private errorState = false;
  private activePuzzle: Puzzle = Puzzle.getRandomPuzzle();
  private foundNumbers: Set<number> = new Set<number>();
  private soundManager: SoundManager = new SoundManager();
  private positionManager: PositionManager = new PositionManager();
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
    this.statusMessage = "Start!";
    this.statusMessageClass = "default";
    this.cellData = [];
    this.foundNumbers = new Set<number>();
    this.errorState = false;
  }

  private init() {
    if (!this.cellData.length) {
      this.activePuzzle = Puzzle.getRandomPuzzle();

      this.addRandomValues(this.activePuzzle.maxSquareValue);
      for (let iTries = 0; iTries < 10; iTries++) {
        if (this.noRemainingSolutions()) {
          this.addRandomValues(this.activePuzzle.maxSquareValue);
          console.log("retry");
        } else {
          break;
        }
      }
      if (this.noRemainingSolutions()) {
        this.statusMessage = "No solutions, try a new game";
      }
    }
  }

  public newGame() {
    document.getElementById("btnNewGame")?.blur();
    this.reset();
    this.init();
  }


  /* Data */
  private addRandomValues(upperBound: number) {
    this.cellData = [];
    const curatedValues = getUniqueCollection(upperBound, this.positionManager.getRows() * this.positionManager.getColumns());
    for (let idx = 0; idx != this.positionManager.getRows() * this.positionManager.getColumns(); idx++) {
      const value = curatedValues[idx];
      const valid = this.activePuzzle?.predicate(value);
      const data = new DataCell(value, valid, false);
      this.cellData.push(data);
    }
  }

  public getCellData(r: number, c: number): DataCell {
    if (!this.cellData.length) {
      return new DataCell(0, false, false);
    }
    return this.cellData[(r * this.positionManager.getColumns()) + c];
  }

  public noRemainingSolutions(): boolean {
    if (!this.cellData.length) {
      return false;
    }
    const done = this.cellData.every((cell: DataCell) => cell.discovered || !cell.valid);
    return done;
  }

  /* UI State */
  public isActive(cellRow: number, cellColumn: number): boolean {
    return (cellRow == this.positionManager.getActiveRow() && cellColumn == this.positionManager.getActiveColumn());
  }

  public getImage(): string {
    const data = this.getCellData(this.positionManager.getActiveRow(), this.positionManager.getActiveColumn());
    if (this.errorState) {
      return "assets/muncher-sad.png";
    }
    if (data.valid && data.discovered)
      return "assets/muncher-happy.png";
    else {
      return "assets/muncher-neutral.png";
    }
  }

  public getQuestionPrompt(): string {
    return this.activePuzzle?.questionText;
  }

  public getStatusMessage(): string {
    return this.statusMessage;
  }

  public getStatusMessageClass(): string {
    return this.statusMessageClass;
  }

  public getFoundNumbers(): string {
    return "Found: " + [...this.foundNumbers].join(", ");
  }

  public getButtonClass(): string {
    const done = this.noRemainingSolutions() ? "btn-success button-success" : "btn-primary";
    return done;
  }

  public getCellClass(cellRow: number, cellColumn: number): string {
    let classes = "";
    const cell: DataCell = this.getCellData(cellRow, cellColumn);
    if (!cell) {
      classes = "default";
    }
    if (cell.discovered) {
      classes = "discovered";
    }
    if (cellRow == this.positionManager.getActiveRow() && cellColumn == this.positionManager.getActiveColumn()) {
      classes += " active";
    }
    return classes;
  }

  /* Mouse and Keyboard */
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.errorState = false;
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
  handleTouchEvent(event: any) {
    if (this.noRemainingSolutions()) {
      return;
    }
    let rowColumn: number[] = [];
    try {
      rowColumn = parseId(event.target.id);
    } catch (err) {
      return;
    }
    this.positionManager.setActiveRow(rowColumn[0]);
    this.positionManager.setActiveColumn(rowColumn[1]);
    this.choiceAction();
  }

  private up() {
    this.positionManager.setActiveRow(wrapUp(this.positionManager.getActiveRow(), this.positionManager.getRows()));
    console.log(this.positionManager.getActiveRow() + ", " + this.positionManager.getActiveColumn());
  }

  private down() {
    this.positionManager.setActiveRow(wrapDown(this.positionManager.getActiveRow(), this.positionManager.getRows()));
    console.log(this.positionManager.getActiveRow() + ", " + this.positionManager.getActiveColumn());
  }

  private left() {
    this.positionManager.setActiveColumn(wrapDown(this.positionManager.getActiveColumn(), this.positionManager.getColumns()));
    console.log(this.positionManager.getActiveRow() + ", " + this.positionManager.getActiveColumn());
  }

  private right() {
    this.positionManager.setActiveColumn(wrapUp(this.positionManager.getActiveColumn(), this.positionManager.getColumns()));
    console.log(this.positionManager.getActiveRow() + ", " + this.positionManager.getActiveColumn());
  }

  /* Action */
  private choiceAction(): void {
    this.errorState = false;
    if (this.noRemainingSolutions()) {
      return;
    }
    console.log(this.positionManager.getActiveRow() + ", " + this.positionManager.getActiveColumn());
    const data = this.getCellData(this.positionManager.getActiveRow(), this.positionManager.getActiveColumn());
    if (data.valid) {
      this.cellData[(this.positionManager.getActiveRow() * this.positionManager.getColumns()) + this.positionManager.getActiveColumn()].discovered = true;
      this.foundNumbers.add(data.value);
      if (this.noRemainingSolutions()) {
        this.soundManager.playWhoo();
        this.statusMessageClass = "success";
        this.statusMessage = 'You found all the numbers!';
        return;
      }
      this.soundManager.playYum();
      this.statusMessage = `Correct! ${data.value} is ${this.activePuzzle.responseText}`;
      this.statusMessageClass = "success";

    } else {
      this.soundManager.playYuck();
      this.statusMessage = `Sorry, ${data.value} is not ${this.activePuzzle.responseText}`;
      this.statusMessageClass = "error";
      this.errorState = true;
    }

    console.log(`Correct? ${data.valid}, Value: ${data.value}, Question: ${this.activePuzzle.questionText}`)
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

}