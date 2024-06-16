import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-mixed-value-sentence',
  standalone: true,
  imports: [],
  templateUrl: './mixed-value-sentence.component.html',
  styleUrl: './mixed-value-sentence.component.less'
})
export class MixedValueSentenceComponent implements AfterViewInit, OnChanges {
  public trustedMathML!: SafeHtml;
  constructor(private sanitizer: DomSanitizer) {
  }
  private update(): void {
    this.trustedMathML = this.sanitizer
      .bypassSecurityTrustHtml(this.mathML);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ngOnChanges(changes: SimpleChanges): void {
    this.update();
  }
  ngAfterViewInit(): void {
    this.update();
  }
  @Input() mathML!: string;
}
