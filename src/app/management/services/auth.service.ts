import { Injectable } from '@angular/core';
import {HttpBaseService} from "../../shared/services/http-base.service";
import {HttpClient} from "@angular/common/http";
import {SignIn} from "../models/sign-in";
import {CookieService} from "ngx-cookie-service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService extends HttpBaseService<SignIn> {
  private readonly TOKEN_KEY: string = '12f3cab1d76d3c2086c2761d1a44561cd2fe7eda82d77d5a5016a46d16c11f36';

  constructor(http: HttpClient, private cookieService: CookieService) {
    super(http);
    this.resourceEndpoint = '/auth/log-in';
  }

  public getToken(): string | null {
    return this.cookieService.get(this.TOKEN_KEY);
  }
  public saveToken(token: string): void {
    this.cookieService.set(this.TOKEN_KEY, token, { secure: true, sameSite: 'Strict' });
  }
  public removeToken(): void {
    this.cookieService.delete(this.TOKEN_KEY);
  }
  public signOut(): void {
    this.removeToken();
    this.isLoggedInSubject.next(false);
    window.location.reload();
  }
  public isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }
}
