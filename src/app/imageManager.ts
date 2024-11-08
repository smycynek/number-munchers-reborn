export class ImageManager {

public preload(holiday: string) {
        const happy = new Image();
        happy.src = this.getMunchyHappyImage(holiday);

        const sad = new Image();
        sad.src = this.getMunchyNeutralImage();

        const neutral = new Image();
        neutral.src = this.getMunchySadImage();

        const mertin = new Image();
        mertin.src = this.getMertinImage(holiday);
      }


  public getMunchyImage(holiday: string): string {
    return `assets/munchy${holiday}-happy.svg`;
  }
  public getMertinImage(holiday: string): string {
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
    return `assets/munchy${holiday}-happy.svg`;
  }

  public getMunchySadImage(): string {
    return 'assets/munchy-sad.svg';
  }

  public getMunchyNeutralImage(): string {
    return 'assets/munchy-neutral.svg';
  }
}
