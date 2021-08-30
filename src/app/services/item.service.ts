import { Injectable } from '@angular/core';
import {Service} from "./service";
import {HttpClient, HttpParams, HttpEvent, HttpEventType} from "@angular/common/http";
import {Observable, from, of, throwError, scheduled} from "rxjs";
import {catchError, map, flatMap, concatMap, mergeMap} from 'rxjs/operators';

import {Router} from "@angular/router";
import {AuthService} from "./auth.service";


@Injectable({
  providedIn: 'root'
})
export class ItemService extends Service<Item> {

  endpoint = this.getEndpoint();

  constructor(protected http: HttpClient,
              protected router: Router,
              protected authService: AuthService) {
    super('', http, router, authService);
  }

  public create(params, progressFn=null): Observable<Item> {
    return this.http.post(this.getEndpoint() + 'items', params).pipe(
      mergeMap(created => {
        if (params.file && created) {
          return this.uploadFile(created['id'], params.file).pipe(
            map((event) => {
              switch (event.type) {
                case HttpEventType.UploadProgress:
                  let uploadProgress = Math.round(event.loaded / event.total * 100);
                  console.log(`Uploaded! ${uploadProgress}%`);
                  if (progressFn) {
                    progressFn(uploadProgress);
                  }
                  break;
                case HttpEventType.Response:
                  console.log('Successfully uploaded!');
                  return created;
              }
            }),
            catchError(err => {
              //first delete the item!
              return this.delete(created['id']).pipe(
                mergeMap((res) => {
                  return throwError(err);
                })
              );
            }));
        } else {
          return of(created);
        }
      }),
      catchError(this.handleErrorAndRethrow(this.path, []))
    );
  }

  public update(id, params): Observable<Item> {
    return this.http.put(this.getEndpoint() + 'items/' + id, params).pipe(
      catchError(this.handleError(this.path, []))
    );
    /*
    return this.http.get(this.getEndpoint() + 'public').pipe(
      catchError(this.handleError('public', []))
    );*/
  }

  public delete(id): Observable<Item> {
    return this.http.delete(this.getEndpoint() + 'items/' + id).pipe(
      catchError(this.handleError(this.path, []))
    );
  }

  private getParams(query: Query): HttpParams {
    let params = new HttpParams();
    if (query) {
      if (query.name) {
        params = params.append('name', query.name);
      }
      if (query.public) {
        params = params.append('public', query.public.toString());
      }
      if (query.around) {
        params = params.append('around', query.around.toString());
      }
      if (query.myItems) {
        params = params.append('my_items', query.myItems.toString());
      }
      if (query.parentId) {
        params = params.append('parent_id', query.parentId.toString());
      }
      if (query.lat) {
        params = params.append('lat', query.lat.toString());
      }
      if (query.lng) {
        params = params.append('lng', query.lng.toString());
      }
      if (query.radius) {
        params = params.append('radius', query.radius.toString());
      }
      if (query.types) {
        params = params.append('types', query.types.join(', '));
      }
      if (query.tags) {
        params = params.append('tags', query.tags.join(', '));
      }
    }
    return params;
  }

  public items(query: Query): Observable<[Item]> {
    const httpOptions = {
      params: this.getParams(query)
    };

    if (this.authService.isLoggedIn()) {
      return this.http.get(this.getEndpoint() + 'items', httpOptions).pipe(
        catchError(this.handleError(this.path, []))
      );
    } else {
      return this.http.get(this.getEndpoint() + 'public/items', httpOptions).pipe(
        catchError(this.handleError(this.path, []))
      );
    }
  }

  public types(): Observable<[Type]> {
    return this.http.get(this.getEndpoint() + 'types').pipe(
      catchError(this.handleError(this.path, []))
    );
  }

  public getItem(id): Observable<Item> {
    if (this.authService.isLoggedIn()) {
      return this.http.get(this.getEndpoint() + 'items/' + id).pipe(
        catchError(this.handleError(this.path, []))
      );
    } else {
      return this.http.get(this.getEndpoint() + 'public/items/' + id).pipe(
        catchError(this.handleError(this.path, []))
      );
    }
  }

  public uploadFile(id, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http
      .put(this.getEndpoint() + 'items/' + id + '/data', formData, {
        reportProgress: true,
        observe: 'events'
      })
      .pipe(catchError(this.handleErrorAndRethrow(this.path, [])));
  }

  public async canUserEditItem(id) : Promise<boolean> {
    try {
      // await this.http.get(this.getEndpoint() + 'items/' + id + '/isMine', {observe: 'response'}).toPromise();
      return true;
    }
    catch(e) {
      return false;
    }
  }

  public getLink(item: Item): string {
    if (item && item.link && item.link.startsWith('http')) {
      if (item.link.startsWith('https://realnet.io/')) {
        return item.link.slice(19);
      }
      return item.link;
    } else if (item && item.link) {
      return 'https://' + item.link;
    } else if (item) {
      return (item.public ? '/public/items/' : '/items/') + item.id;
    } else {
      return null;
    }
  }

  public getLinkedItemId(item: Item): string {
    if (item && item.link && item.link.startsWith('http')) {
      if (item.link.startsWith('https://realnet.io/')) {
        return item.link.slice(25);
      }
    }
    return null;
  }

  isInternalLink(item: Item): boolean {
    return item && item.link && item.link.startsWith('https://realnet.io/');
  }

  isLink(item: Item): boolean {
    return item && item.link !== null;
  }

  getQueryString(query: Query): string {
    let result = 'Show ';

    if (query.public && query.myItems) {
      result += ' items ';
    } else if (query.public) {
      result += ' public items ';
    } else if (query.myItems) {
      result += ' my items ';
    } else {
      result += ' items ';
    }

    if (query.types && query.types.length > 0) {
      result += ' of type ' + query.types.join(',');
    } else {
      result += ' of any type';
    }
    if (query.name) {
      result += ' named ' + query.name;
    }
    if (query.tags && query.tags.length > 0) {
      result += ' tagged with ' + query.tags.join(', ');
    }
    if (query.around && query.lat && query.lng) {
      result += ' in ' + query.radius + ' m radius around ' + query.lat.toFixed(4) + ', ' + query.lng.toFixed(4);
    }
    return result;
  }
}

export class Type {
  name: string;
  icon: string;
}


export class Item {
  id: string;
  attributes: object;
  description: string;
  name: string;
  link: string;
  public: boolean;
  type: object;
  parent_id: string;
  tags?: string[];
  point: object;
  status: string;
}

export class Query {
  types?: string[];
  tags?: string[];
  name?: string;
  public?: boolean;
  around?: boolean;
  myItems?: boolean;
  parentId?: string;
  lat?: number;
  lng?: number;
  radius?: number;
}
