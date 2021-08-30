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

  public isLoggedIn(): boolean {
    const res = localStorage.getItem('access_token') != null;
    console.log('logged_in: ', res);
    return res;
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
    window.location.href = this.getEndpoint() + '/tenants/public/login/' + auth.name + '?client_id=realscape';
  }

  public logout() {
    localStorage.removeItem('access_token');
  }

  public authenticators(): Observable<any> {
    return this.http.get(this.getEndpoint() + '/tenants/public/auth');
    return this.http.get(this.getEndpoint() + '/tenants/public/auth').pipe(
      catchError(this.handleError('/tenants/public/auth', []))
    );
  }

  protected handleError(operation = 'operation', result?: any) {
    return (error: any): Observable<any> => {
      return of(error);
    };
  }
}
