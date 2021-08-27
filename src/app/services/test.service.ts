import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(protected http: HttpClient) { }

  protected getEndpoint() {
    return (environment['api'] || '');
  }

  protected handleError(operation = 'operation', result?: any) {
    return (error: any): Observable<any> => {
      console.log(error);
      return of(error);
    };
  }

  public testPublic(): Observable<any> {
    return this.http.get(this.getEndpoint() + '/public').pipe(
      catchError(this.handleError('public', []))
    );
  }

  public testPrivate(): Observable<any> {
    return this.http.get(this.getEndpoint() + '/private').pipe(
      catchError(this.handleError('private', []))
    );
  }
}
