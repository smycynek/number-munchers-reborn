export interface ISoundService {
  playYum(): void;
  playYuck(): void;
  playWhoo(): void;
  playCackle(): void;
  playPerfectScore(): void;
  playWhooAndPerfectScore(): void;
  getSoundOn(): boolean;
  toggleSound(): void;
}

export class SoundService implements ISoundService {
  constructor() {
    this.yum.src = './assets/yum.mp3';
    this.yum.preload = 'auto';
    this.yum.load();
    this.yuck.src = './assets/yuck.mp3';
    this.yuck.preload = 'auto';
    this.yuck.load();
    this.whoo.src = './assets/whoo.mp3';
    this.whoo.preload = 'auto';
    this.whoo.load();
    this.perfectScore.src = './assets/perfectScore.mp3';
    this.perfectScore.preload = 'auto';
    this.perfectScore.load();
    this.cackle.src = './assets/cackle.mp3';
    this.cackle.preload = 'auto';
    this.cackle.load();
  }
  private yum = new Audio();
  private yuck = new Audio();
  private whoo = new Audio();
  private cackle = new Audio();
  private perfectScore = new Audio();
  private sound: boolean = true;

  public playCackle(): void {
    if (this.sound) {
      this.cackle.play();
      const cacklec = this.cackle.cloneNode() as HTMLAudioElement;
      cacklec.preload = 'auto';
      cacklec.load();
      this.cackle = cacklec;
    }
  }

  public playYum() {
    if (this.sound) {
      this.yum.play();
      const yumc = this.yum.cloneNode() as HTMLAudioElement;
      yumc.preload = 'auto';
      yumc.load();
      this.yum = yumc;
    }
  }

  public playYuck() {
    if (this.sound) {
      this.yuck.play();
      const yuckc = this.yuck.cloneNode() as HTMLAudioElement;
      yuckc.preload = 'auto';
      yuckc.load();
      this.yuck = yuckc;
    }
  }

  public playWhoo() {
    if (this.sound) {
      this.whoo.play();
      const whooc = this.whoo.cloneNode() as HTMLAudioElement;
      whooc.preload = 'auto';
      whooc.load();
      this.whoo = whooc;
    }
  }

  public playPerfectScore() {
    if (this.sound) {
      this.perfectScore.play();
      const perfectScorec = this.perfectScore.cloneNode() as HTMLAudioElement;
      perfectScorec.preload = 'auto';
      perfectScorec.load();
      this.perfectScore = perfectScorec;
    }
  }

  public playWhooAndPerfectScore() {
    this.whoo.addEventListener('ended', () => this.playPerfectScore());
    this.playWhoo();
  }

  public getSoundOn(): boolean {
    return this.sound;
  }

  public toggleSound(): void {
    this.sound = !this.sound;
  }
}
