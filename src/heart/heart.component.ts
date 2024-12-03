import { Component, input } from '@angular/core';

@Component({
  selector: 'app-heart',
  standalone: true,
  imports: [],
  templateUrl: './heart.component.html',
  styleUrl: './heart.component.less',
})
export class HeartComponent {
  value = input.required<string>();

  public format(val: string): string {
    // TODO: replace with pipe ?
    return val.padStart(2, '0');
  }
}
