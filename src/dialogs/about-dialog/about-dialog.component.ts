import { Component, EventEmitter, Output } from '@angular/core';
import { ImageService } from '../../app/services/image.service';
import { GameInfoService } from '../../app/services/game-info.service';

@Component({
  selector: 'app-about-dialog',
  standalone: true,
  imports: [],
  templateUrl: './about-dialog.component.html',
  styleUrl: '../../app/less/numberMunchers.component.less',
})
export class AboutDialogComponent {
  public constructor(
    protected imageService: ImageService,
    protected gameInfoService: GameInfoService,
  ) {}
  @Output() puzzleTypesClicked = new EventEmitter<void>();
}
