import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import { of } from 'rxjs';
import {catchError} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(protected http: HttpClient) { }

  protected getEndpoint() {
    return (environment['api'] || '');
  }

  protected getClientId() {
    return (environment['client_id'] || null);
  }

  public isLoggedIn(): boolean {
    return localStorage.getItem('access_token') != null;
  }

  public getAccessToken() {
    return localStorage.getItem('access_token');
  }

  public setAccessToken(token) {
    localStorage.setItem('access_token', token);
  }

  public tryLogin(): Observable<boolean> {
    return of(false);
  }

  public login(auth) {
    if (auth.type === 'password') {
      window.location.href = this.getEndpoint() + '/public/login?client_id=' + this.getClientId() + '&response_type=token';
    } else {
      window.location.href = this.getEndpoint() + '/public/login/' + auth.name + '?client_id=' + this.getClientId();
    }
  }

  public logout() {
    localStorage.removeItem('access_token');
  }

  public authenticators(): Observable<any> {
    return this.http.get(this.getEndpoint() + '/public/auth');
    return this.http.get(this.getEndpoint() + '/public/auth').pipe(
      catchError(this.handleError('/public/auth', []))
    );
  }

  protected handleError(operation = 'operation', result?: any) {
    return (error: any): Observable<any> => {
      return of(error);
    };
  }
}
