import { Observable, of, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';
import {KeycloakService} from "keycloak-angular";


export abstract class Service<T> {

  protected constructor(protected path: string,
                        protected http: HttpClient,
                        protected router: Router,
                        protected keycloakService: KeycloakService) {}

  protected getEndpoint() {
    return (environment['api'] || '') + '/' + this.path;
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
        //navigate /delete cookies or whatever
        if (error.status === 401) {
          return of(this.keycloakService.login());
        } else if(error.status === 403) {
          this.keycloakService.isLoggedIn().then(loggedIn => {
            if (loggedIn) {
              //redirect to 403
              this.router.navigateByUrl(`/error`);
              return of(error);
            } else {
              return of(this.keycloakService.login());
            }
          });
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
