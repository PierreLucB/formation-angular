import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { environment } from '../environments/environement';
import { routes } from './app.routes';
import { loggingInterceptor } from './interceptors/logging.interceptor';
import { apiUrlToken } from './tokens';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptors([loggingInterceptor])
    ),
    { provide: apiUrlToken, useValue: environment.apiUrl }
  ]
};
