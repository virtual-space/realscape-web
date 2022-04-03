import { Injectable } from '@angular/core';
import {Observable, from, of, throwError, scheduled} from "rxjs";
import {catchError, map, flatMap, concatMap, mergeMap} from 'rxjs/operators';
import {HttpClient, HttpParams, HttpEvent, HttpEventType} from "@angular/common/http";
import {Service} from "./service";
import {Item} from "./item.service";
import {Router} from "@angular/router";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class AppService extends Service<App>  {

  constructor(protected http: HttpClient,
              protected router: Router,
              protected authService: AuthService) {
    super('items', http, router, authService);
  }

  public apps(): Observable<[Item]> {
    let params = new HttpParams();
    params = params.append('my_items', 'true');
    params = params.append('types', 'Apps');
    
    const httpOptions = {
      params: params
    };

    return this.http.get(this.getAccessibleEndpoint(), httpOptions).pipe(
      mergeMap(apps => this.http.get(this.getAccessibleEndpoint() + '?parent_id=' + apps[0].id)),
      catchError(this.handleError(this.path, []))
    );
  }
}

export class App {
  id: string;
  name: string;
}
