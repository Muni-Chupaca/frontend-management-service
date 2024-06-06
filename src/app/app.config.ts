import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {HttpBaseService} from "./shared/services/http-base.service";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AuthIntercept} from "./shared/services/auth-intercept/auth-intercept.service";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), HttpBaseService, importProvidersFrom(HttpClientModule, BrowserModule, BrowserAnimationsModule),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthIntercept,
      multi: true
    }]
};
