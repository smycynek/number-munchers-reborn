import { ChangeDetectionStrategy } from '@angular/core';
import { Component, output } from '@angular/core';

@Component({
  selector: 'app-welcome-dialog',
  imports: [],
  templateUrl: './welcome-dialog.component.html',
  styleUrl: '../../app/less/number-munchers.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeDialogComponent {
  puzzleTypesClicked = output();
}
