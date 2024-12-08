import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/number-munchers.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);
