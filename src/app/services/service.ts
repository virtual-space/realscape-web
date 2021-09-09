import { Observable, of, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';
import {AuthService} from './auth.service';



export abstract class Service<T> {

  protected constructor(protected path: string,
                        protected http: HttpClient,
                        protected router: Router,
                        protected authService: AuthService) {}

  protected getEndpoint() {
    return (environment['api'] || '') + '/' + this.path;
  }

  protected getAccessibleEndpoint(excludePath= false) {
    if (this.authService.isLoggedIn()) {
      if (excludePath) {
        const p = environment['api'];
        if (p) {
          if (p.endsWith('/')) {
            return p;
          } else {
            return p + '/';
          }
        } else {
          return '';
        }
      } else {
        return (environment['api'] || '') + '/' + this.path;
      }
    } else {
      if (excludePath) {
        return environment['api'] || '/public/';
      } else {
        return (environment['api'] || '') + '/public/' + this.path;
      }
    }
  }

  protected handleErrorAndRethrow(operation = 'operation', result?: any) {
    return (error: any): Observable<any> => {
      console.log(error);
      return throwError(error);
    };
  }
  protected handleError(operation = 'operation', result?: any) {
    return (error: any): Observable<any> => {
      if (error.status === 401 || error.status === 403) {
        // navigate /delete cookies or whatever
        if (error.status === 401) {
          return of(this.authService.tryLogin());
        } else if(error.status === 403) {
          if (this.authService.isLoggedIn()) {
            this.router.navigateByUrl(`/error`);
            return of(error);
          } else {
            return of(this.authService.tryLogin());
          }
        }
        // if you've caught / handled the error, you don't want to rethrow it unless you also want downstream consumers to have to handle it as well.
        return of(error); // or EMPTY may be appropriate here
      }
      return of(error);
    };
  }
  public get(id): Observable<T> {
    return this.http.get(this.getEndpoint() + '/' + id).pipe(
      catchError(this.handleError(this.path, []))
    );
  }
  public delete(id): Observable<T> {
    return this.http.delete(this.getEndpoint() + '/' + id).pipe(
      catchError(this.handleError(this.path, []))
    );
  }
  public create(params): Observable<T> {
    return this.http.post(this.getEndpoint(), params).pipe(
      catchError(this.handleError(this.path, []))
    );
  }
  public update(id, params): Observable<T> {
    return this.http.put(this.getEndpoint() + '/' + id, params).pipe(
      catchError(this.handleError(this.path, []))
    );
  }

  public patch(id, params): Observable<T> {
    return this.http.patch(this.getEndpoint() + '/' + id, params).pipe(
      catchError(this.handleError(this.path, []))
    );
  }
  protected performSearch(params): Observable<[T]> {
    return this.http.get(this.getEndpoint(), { params }).pipe(
      catchError(this.handleError(this.path, []))
    );
  }
}
