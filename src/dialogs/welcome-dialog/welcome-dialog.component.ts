import { Component, output } from '@angular/core';

@Component({
  selector: 'app-welcome-dialog',
  standalone: true,
  imports: [],
  templateUrl: './welcome-dialog.component.html',
  styleUrl: '../../app/less/number-munchers.component.less',
})
export class WelcomeDialogComponent {
  puzzleTypesClicked = output();
  public test() {
    this.puzzleTypesClicked.emit();
  }
}
