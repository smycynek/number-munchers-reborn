export class SoundManager {
  constructor() {
    this.yum.src = './assets/yum.mp3';
    this.yum.load();
    this.yuck.src = './assets/yuck.mp3';
    this.yuck.load();
    this.whoo.src = './assets/whoo.mp3';
    this.whoo.load();
  }
  private yum = new Audio();
  private yuck = new Audio();
  private whoo = new Audio();
  private sound: boolean = true;

  public playYum() {
    if (this.sound) {
      this.yum.play();
    }
  }

  public playYuck() {
    if (this.sound) {
      this.yuck.play();
    }
  }

  public playWhoo() {
    if (this.sound) {
      this.whoo.play();
    }
  }

  public getSoundOn(): boolean {
    return this.sound;
  }

  public toggleSound(): void {
    this.sound = !this.sound;
  }


}