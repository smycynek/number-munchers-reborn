import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface MuncherConfig {
  holiday: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config: MuncherConfig = { holiday: '' };
  private http = inject(HttpClient);
  constructor() {}
  async loadConfig() {
    const result = this.http.get('config/config.json', {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    const config = await firstValueFrom(result);
    this.config = config as MuncherConfig;
  }
  getConfig(): MuncherConfig {
    return this.config;
  }
}
