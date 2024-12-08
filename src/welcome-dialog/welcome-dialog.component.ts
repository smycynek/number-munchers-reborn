import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-welcome-dialog',
  standalone: true,
  imports: [],
  templateUrl: './welcome-dialog.component.html',
  styleUrl: '../app/less/numberMunchers.component.less',
})
export class WelcomeDialogComponent {
  @Output() puzzleTypesClicked = new EventEmitter<void>();
  public test() {
    this.puzzleTypesClicked.emit();
  }
}
