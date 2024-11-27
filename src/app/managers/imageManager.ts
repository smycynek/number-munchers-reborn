export class ImageManager {
  public preload(holiday: string) {
    const happy = new Image();
    happy.src = this.getMunchyHappyImage(holiday);

    const sad = new Image();
    sad.src = this.getMunchyNeutralImage(holiday);

    const neutral = new Image();
    neutral.src = this.getMunchySadImage(holiday);

    const mertin = new Image();
    mertin.src = this.getMertinImage(holiday);
  }

  public getMertinImage(holiday: string): string {
    if (holiday === '-af') {  // af = april fool's day = avatars switched
      return 'assets/munchy-happy.svg';
    }
    return `assets/mertin${holiday}.svg`;
  }

  public getMunchyImageStandard(): string {
    return 'assets/munchy-happy.svg';
  }
  public getMertinImageStandard(): string {
    return 'assets/mertin.svg';
  }

  public getMertinButtonImage(speed: number): string {
    return `assets/mertin-${speed}.svg`;
  }

  public getMunchyHappyImage(holiday: string): string {
    if (holiday === '-af') {
      return 'assets/mertin.svg';
    }
    return `assets/munchy${holiday}-happy.svg`;
  }

  public getMunchySadImage(holiday: string): string {
    if (holiday === '-af') { // af = april fool's day = avatars switched
      return 'assets/mertin-sad.svg';
    }
    return 'assets/munchy-sad.svg';
  }

  public getMunchyNeutralImage(holiday: string): string {
    if (holiday === '-af') {
      return 'assets/mertin-neutral.svg';
    }
    return 'assets/munchy-neutral.svg';
  }
}
