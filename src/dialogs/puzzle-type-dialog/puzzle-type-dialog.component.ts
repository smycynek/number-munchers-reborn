import { Component, output } from '@angular/core';
import {
  PuzzleType,
  PuzzleTypeService,
} from '../../app/services/puzzleType.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-puzzle-type-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './puzzle-type-dialog.component.html',
  styleUrl: '../../app/less/numberMunchers.component.less',
})
export class PuzzleTypeDialogComponent {
  constructor(protected puzzleTypeService: PuzzleTypeService) {}
  urlChanged = output<string>();
  settingChanged = output<void>();
  protected toggleType(
    value: boolean,
    puzzleType: PuzzleType,
    updateQuery?: boolean,
  ) {
    const puzzleCodes = this.puzzleTypeService.toggleType(
      value,
      puzzleType,
      updateQuery,
    );
    this.urlChanged.emit(puzzleCodes);
  }

  protected closeDialog(): void {
    if (this.puzzleTypeService.settingsChanged()) {
      this.settingChanged.emit();
      this.puzzleTypeService.settingsChanged.set(true);
    }
  }
}
