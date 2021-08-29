import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

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

  public login() {
    window.location.href = 'http://localhost:8080/tenants/public/login/google?client_id=realscape';
  }

  public logout() {
    this.setAccessToken(null);
  }
}
