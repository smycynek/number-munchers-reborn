import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-heart',
  standalone: true,
  imports: [],
  templateUrl: './heart.component.html',
  styleUrl: './heart.component.less',
})
export class HeartComponent {
  @Input()
  public value = '';

  public format(val: string) {
    return val.padStart(2, '0');
  }
}
