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

  protected getHome() {
    return (environment['home'] || '');
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

  public setAccessToken(token: string) {
    localStorage.setItem('access_token', token);
  }

  public tryLogin(): Observable<boolean> {
    return of(false);
  }

  public login(auth: Authenticator) {
    if (auth.type === 'password') {
      window.location.href = this.getEndpoint() + '/public/login?client_id=' + auth.client_id + '&response_type=token';
    } else {
      window.location.href = this.getEndpoint() + '/public/login/' + auth.name + '?client_id=' + auth.client_id + '&response_type=token';
    }
  }

  public logout() {
    localStorage.removeItem('access_token');
    window.location.href = this.getHome();
  }

  public authenticators(): Observable<[Authenticator]> {
    return this.http.get<[Authenticator]>(this.getEndpoint() + '/public/auth').pipe(
      catchError(this.handleError('/public/auth', []))
    );
  }

  protected handleError(operation = 'operation', result?: any) {
    return (error: any): Observable<any> => {
      return of(error);
    };
  }
}

export class Authenticator {
  name: string;
  type: string;
  client_id: string;
  api: string;

  constructor(name: string, 
              type: string, 
              client_id: string,
              api: string) {
    this.name = name;
    this.type = type;
    this.client_id = client_id;
    this.api = api;
  }
}
