export class SoundManager {
  constructor() {
    this.yum.src = './assets/yum.mp3';
    this.yum.preload = "auto";
    this.yum.load();
    this.yuck.src = './assets/yuck.mp3';
    this.yuck.preload = "auto";
    this.yuck.load();
    this.whoo.src = './assets/whoo.mp3';
    this.whoo.preload = "auto";
    this.whoo.load();
  }
  private yum = new Audio();
  private yuck = new Audio();
  private whoo = new Audio();
  private sound: boolean = true;

  public playYum() {
    if (this.sound) {
      const yumc = this.yum.cloneNode() as HTMLAudioElement;
      yumc.play();
    }
  }

  public playYuck() {
    if (this.sound) {
      const yuckc = this.yuck.cloneNode() as HTMLAudioElement;
      yuckc.play();
    }
  }

  public playWhoo() {
    if (this.sound) {
      const whooc = this.whoo.cloneNode() as HTMLAudioElement;
      whooc.play();
    }
  }

  public getSoundOn(): boolean {
    return this.sound;
  }

  public toggleSound(): void {
    this.sound = !this.sound;
  }


}