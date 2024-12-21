import { AfterContentInit, Component, output } from '@angular/core';
import {
  PuzzleType,
  PuzzleTypeService,
  puzzleTypeTitles,
} from '../../app/services/puzzle-type.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-puzzle-type-dialog',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './puzzle-type-dialog.component.html',
  styleUrl: '../../app/less/number-munchers.component.less',
})
export class PuzzleTypeDialogComponent implements AfterContentInit {
  constructor(
    protected puzzleTypeService: PuzzleTypeService,
    private fb: FormBuilder,
  ) {
    this.hiddenPuzzleTypeValidator = fb.control(true);
    this.puzzleTypesFormGroup = fb.group({});

    this.mainFormGroup = fb.group({});
    this.mainFormGroup.addControl(
      'hiddenPuzzleTypeValidator',
      this.hiddenPuzzleTypeValidator,
    );
    this.mainFormGroup.addControl(
      'puzzleTypesFormGroup',
      this.puzzleTypesFormGroup,
    );

    this.puzzleTypesFormGroup.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => {
        const settings: boolean[] = Object.values(value);
        if (settings.findIndex((f) => !!f) !== -1) {
          this.hiddenPuzzleTypeValidator.setErrors(null);
        } else {
          this.hiddenPuzzleTypeValidator.setErrors({ e: 1 });
        }
      });
  }

  ngAfterContentInit(): void {
    for (const puzzleTypeString of this.PuzzleTypeStrings) {
      const puzzleTypeStringEnum =
        PuzzleType[puzzleTypeString as keyof typeof PuzzleType];
      const enabled = this.puzzleTypeService
        .getPuzzleTypes()
        .has(puzzleTypeStringEnum);
      this.puzzleTypesFormGroup.addControl(
        puzzleTypeString,
        new FormControl(enabled),
      );
    }

    const thisDialog = document.getElementById('puzzleTypeDialog');
    if (thisDialog) {
      thisDialog.addEventListener('cancel', () => this.cancelAndClose());
    }
  }

  // Used to reset dialog values if user cancels or  hits escape
  protected cancelAndClose() {
    for (const puzzleTypeString of this.PuzzleTypeStrings) {
      const puzzleTypeStringEnum =
        PuzzleType[puzzleTypeString as keyof typeof PuzzleType];
      const enabled = this.puzzleTypeService
        .getPuzzleTypes()
        .has(puzzleTypeStringEnum);
      const control = this.puzzleTypesFormGroup.get(puzzleTypeString);
      control?.setValue(enabled);
    }
    this.puzzleTypesFormGroup.markAsPristine();
    const thisDialog = document.getElementById(
      'puzzleTypeDialog',
    ) as HTMLDialogElement;
    thisDialog.close();
  }
  protected getPuzzleTypeTitle(puzzleType: string): string {
    return puzzleTypeTitles.get(puzzleType) ?? puzzleType;
  }

  protected submitEffects = output<string>();

  protected get puzzleTypesFormGroupNames() {
    return Object.keys(this.puzzleTypesFormGroup.controls);
  }

  protected clearAll(): void {
    this.PuzzleTypeStrings.forEach((name) => {
      this.puzzleTypesFormGroup.get(name)?.setValue(false);
    });
  }

  protected get PuzzleType() {
    return PuzzleType;
  }

  protected get PuzzleTypeStrings(): string[] {
    const strings = Object.values(PuzzleType)
      .filter((t) => isNaN(Number(t)))
      .map((t) => t.toString());
    return strings;
  }

  protected mainFormGroup: FormGroup;
  protected puzzleTypesFormGroup: FormGroup;
  protected hiddenPuzzleTypeValidator: FormControl;

  public submit(): void {
    if (this.puzzleTypesFormGroup.pristine) {
      return;
    }

    for (const puzzleTypeName of this.PuzzleTypeStrings) {
      const control = this.puzzleTypesFormGroup.get(puzzleTypeName);
      const enabled = control?.value;
      const puzzleTypeNameEnum =
        PuzzleType[puzzleTypeName as keyof typeof PuzzleType];
      this.puzzleTypeService.toggleType(enabled, puzzleTypeNameEnum, true);
    }

    let activeTypeCodes = this.puzzleTypeService.getActivePuzzleCodes();
    if (
      this.puzzleTypeService.getPuzzleTypes().size ===
      Object.keys(PuzzleType).length / 2
    ) {
      activeTypeCodes = '';
    }
    this.puzzleTypesFormGroup.markAsPristine();
    this.submitEffects.emit(activeTypeCodes);
  }
}
