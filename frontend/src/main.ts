import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { errorInterceptor } from './app/core/interceptors/error.interceptor'

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
