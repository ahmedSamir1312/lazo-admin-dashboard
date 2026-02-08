import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatNativeDateModule } from '@angular/material/core';
import { provideToastr } from 'ngx-toastr';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { ModalModule } from 'ngx-bootstrap/modal';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([JwtInterceptor])),
    provideAnimationsAsync(),
    importProvidersFrom(MatNativeDateModule , ModalModule.forRoot()),
    provideAnimations(),
    provideToastr(),
      
  ],
};
