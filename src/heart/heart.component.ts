import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-heart',
  imports: [NgOptimizedImage],
  templateUrl: './heart.component.html',
  styleUrl: './heart.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeartComponent {
  value = input.required<string>();

  public format(val: string): string {
    // TODO: replace with pipe ?
    return val.padStart(2, '0');
  }
}
