import {Injectable} from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {AuthService} from './services/auth.service';
import {tap} from "rxjs/operators";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router,
              private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>,
            next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.headers.get('No-Auth') === 'True') {
      return next.handle(req.clone());
    }

    if (this.authService.isLoggedIn()) {
      const clonedReq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + this.authService.getAccessToken())
      });
      return next.handle(clonedReq).pipe(
        tap(succ => {}, err => {
          // TODO: remove hack below when server gets fixes (returns 500 now instead of 401)
          if (err.status === 401 || err.status === 500) {
            this.authService.login();
          }
        })
      );
    } else {
      this.authService.login();
    }
  }
}
