import { Component, input } from '@angular/core';

@Component({
  selector: 'app-heart',
  standalone: true,
  imports: [],
  templateUrl: './heart.component.html',
  styleUrl: './heart.component.less',
})
export class HeartComponent {
  value = input<string>('');

  public format(val: string): string {
    return val.padStart(2, '0');
  }
}
