import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Router} from "@angular/router";
import {catchError, Observable, of, switchMap, take, throwError} from "rxjs";
import {Injectable} from "@angular/core";
import {AuthService} from "../../../management/services/auth.service";


@Injectable()
export class AuthIntercept implements HttpInterceptor {

  constructor(private router: Router, private authService: AuthService) {  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.isUnauthenticatedRequest(request)) {
      return next.handle(request);
    }
    return of(this.authService.getToken()).pipe(
      take(1),
      switchMap((token: string | null) => {
        if (token) {
          const token: string | null = this.authService.getToken();
          if (token) {
            request = request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
          }
        }
        return next.handle(request);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          this.authService.removeToken();
          this.router.navigate(['/auth/log-in'])
            .then((): void => { console.log(`Error | Status = ${ error.status } - Redirected to login page`); });
        }
        return throwError(() => new Error(error.message));
      })
    );
  }
  private isUnauthenticatedRequest(request: HttpRequest<any>): boolean {
    const unauthenticatedUrls: string[] = [
      '/api/v1/auth/log-in',
      '/api/v1/authorized-vehicle/all-by/license-plates',
      '/api/v1/authorized-vehicle/search-by/license-plate',
    ];
    return unauthenticatedUrls.some((url: string): void => { request.url.includes(url); });
  }
}
