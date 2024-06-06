import { Injectable } from '@angular/core';
import {BehaviorSubject, catchError, Observable, retry, Subject, tap, throwError} from "rxjs";
import {environment} from "../../../environments/environment.production";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Authorizedvehicle} from "../../management/models/authorizedvehicle";


@Injectable({
  providedIn: 'root'
})
export class HttpBaseService<T> {
  platesSubject: Subject<string[]> = new Subject<string[]>();
  isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  plates$: Observable<string[]> = this.platesSubject.asObservable();
  basePath: string = environment.serverBasePath;
  resourceEndpoint: string = '/resources';

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer [TOKEN_MANIPULATED_BY_AUTH_INTERCEPTOR]'
    })
  };

  constructor(private http: HttpClient) {  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred: ', error.error.message);
    }
    else {
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
  private resourcePath(): string {
    return this.basePath.concat(this.resourceEndpoint);
  }

  public checkByLicensePlate(licensePlate: string): Observable<boolean> {
    return this.http.post<boolean>(this.resourcePath().concat("/check-by/license-plate"), licensePlate, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
  public getAllLicensePlates(): Observable<string[]> {
    return this.http.get<string[]>(this.resourcePath().concat("/get-all/license-plates"), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError),
        tap((plates: string[]): void => { this.platesSubject.next(plates); })
      );
  }
  public signIn(item: T): Observable<T> {
    return this.http.post<T>(this.resourcePath(), JSON.stringify(item), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError),
        tap((): void => { this.isLoggedInSubject.next(true); })
      );
  }
  public getAuthorizedVehicleByLicensePlate(licensePlate: string): Observable<T> {
    return this.http.post<T>(this.resourcePath().concat("/search-by/license-plate"), licensePlate, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
  public createAll(items: T[]): Observable<T[]> {
    return this.http.post<T[]>(this.resourcePath().concat("/excel-upload"), JSON.stringify(items), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError),
        tap((): void => { this.getAllLicensePlates().subscribe(); })
      );
  }
  public create(item: Authorizedvehicle): Observable<Authorizedvehicle> {
    return this.http.post<Authorizedvehicle>(this.resourcePath(), JSON.stringify(item), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError),
        tap((): void => { this.getAllLicensePlates().subscribe(); })
      );
  }
  public update(id: number, item: T): Observable<T> {
    return this.http.put<T>(this.resourcePath().concat(`/${id}`), JSON.stringify(item), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError),
        tap((): void => { this.getAllLicensePlates().subscribe(); })
      );
  }
  public delete(id: number): Observable<T> {
    return this.http.delete<T>(this.resourcePath().concat(`/${id}`), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError),
        tap((): void => { this.getAllLicensePlates().subscribe(); })
      );
  }
}
