import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { ImageService } from '../../app/services/image.service';
import { GameInfoService } from '../../app/services/game-info.service';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-about-dialog',
  imports: [NgOptimizedImage],
  templateUrl: './about-dialog.component.html',
  styleUrl: '../../app/less/number-munchers.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutDialogComponent {
  public constructor(
    protected imageService: ImageService,
    protected gameInfoService: GameInfoService,
  ) {}
  puzzleTypesClicked = output<void>();
}
