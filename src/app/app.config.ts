import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { ConfigService } from '../configService';
import { provideHttpClient } from '@angular/common/http';

export function appConfigInit(appConfigService: ConfigService) {
  return () => {
    return appConfigService.loadConfig();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAppInitializer(() => {
      const initializerFn = appConfigInit(inject(ConfigService));
      return initializerFn();
    }),
  ],
};
