import { signal, WritableSignal } from '@angular/core';
import { StringResources } from '../strings';
import { hasTouch } from '../utility';
import { environment } from '../../environments/environment';
import { version } from '../version';

export class GameInfoService {
  public getGeneralInstructions(): string {
    if (hasTouch()) {
      return StringResources.TAP_SQUARES;
    } else {
      return StringResources.KEYBOARD;
    }
  }

  public title: WritableSignal<string> = signal(StringResources.TITLE + environment.titleSuffix);

  public getVersion(): number {
    return version;
  }
}
