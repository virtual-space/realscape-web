import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpEvent, HttpEventType} from "@angular/common/http";
import {Observable, from, of, throwError, scheduled} from "rxjs";
import {catchError, map, concatMap, mergeMap} from 'rxjs/operators';
import {Router} from "@angular/router";
import {AuthService} from "./auth.service";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(protected http: HttpClient,
              protected router: Router,
              protected authService: AuthService) {
  }

  protected getEndpoint() {
    return (environment['api'] || '') + '/items';
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
        return (environment['api'] || '') + '/items';
      }
    } else {
      if (excludePath) {
        return environment['api'] || '/public/';
      } else {
        return (environment['api'] || '') + '/public/items';
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

  public delete(id: string): Observable<Item> {
    return this.http.delete(this.getEndpoint() + '/' + id).pipe(
      catchError(this.handleError('/items', []))
    );
  }
  /*
  public create(id: string, params: any): Observable<Item> {
    return this.http.post(this.getEndpoint(), params).pipe(
      catchError(this.handleError('/items', []))
    );
  }*/
  public update(id: string, params: any): Observable<Item> {
    return this.http.put(this.getEndpoint() + '/' + id, params).pipe(
      catchError(this.handleError('/items', []))
    );
  }

  /*
  public patch(id: string, params: any): Observable<Item> {
    return this.http.patch(this.getEndpoint() + '/' + id, params).pipe(
      catchError(this.handleError('/items', []))
    );
  }
*/
  protected performSearch(params: any): Observable<[Item]> {
    return this.http.get<[Item]>(this.getEndpoint(), { params }).pipe(
      catchError(this.handleError('/items', []))
    );
  }

  public create(params: any, progressFn?: (a: number) => void): Observable<Item> {
    return this.http.post<Item>(this.getEndpoint(), params).pipe(
      mergeMap((created: Item) => {
        if (params.file && !!created) {
          return this.uploadFile(created.id!, params['file']).pipe(
            map((event) => {
              switch (event.type) {
                case HttpEventType.UploadProgress: {
                  let uploadProgress = Math.round(event.loaded / event.total * 100);
                  console.log(`Uploaded! ${uploadProgress}%`);
                  if (progressFn) {
                    progressFn(uploadProgress);
                  }
                  return created;
                }
                case HttpEventType.Response: {
                  console.log('Successfully uploaded!');
                  return created;
                }
                default:
                  return created;
              }
            }),
            catchError(err => {
              //first delete the item!
              return this.delete(created.id!).pipe(
                mergeMap((res) => {
                  return throwError(err);
                })
              );
            }));
        } else {
          return of(created);
        }
      }),
      catchError(this.handleErrorAndRethrow('/items', []))
    );
  }
  
  /*
  public update(id: string, params: any): Observable<Item> {
    return this.http.put(this.getEndpoint() + '/' + id, params).pipe(
      catchError(this.handleError('/items', []))
    );
  }
  */
  /*
  public delete(id: string): Observable<Item> {
    return this.http.delete(this.getEndpoint()  + '/' + id).pipe(
      catchError(this.handleError('/items', []))
    );
  }
*/
  private getParams(query: Query): HttpParams {
    let params = new HttpParams();
    if (query) {
      if (query.name) {
        params = params.append('name', query.name);
      }
      if (query.public) {
        params = params.append('public', query.public.toString());
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
      if (query.types && query.types.length > 0) {
        params = params.append('types', query.types.join(', '));
      }
      if (query.tags && query.tags.length > 0) {
        params = params.append('tags', query.tags.join(', '));
      }
    }
    return params;
  }

  public children(id: string): Observable<[Item]> {
    return this.http.get<[Item]>(this.getAccessibleEndpoint() + '?parent_id=' + id).pipe(
      catchError(this.handleError('/items', []))
    );
  }

  public items(query: Query): Observable<[Item]> {
    const httpOptions = {
      params: this.getParams(query)
    };

    return this.http.get<Item>(this.getAccessibleEndpoint(), httpOptions).pipe(
      catchError(this.handleError('/items', []))
    );
  }

  public types(): Observable<[Type]> {
    return this.http.get<Type>(this.getAccessibleEndpoint(true) + 'types').pipe(
      catchError(this.handleError('/items', []))
    );
  }

  public getItem(id: string): Observable<Item> {
    return this.http.get<Item>(this.getAccessibleEndpoint() + '/' + id).pipe(
      catchError(this.handleError('/items', []))
    );
  }

  public getDataLink(id: string) {
    return this.getAccessibleEndpoint() + '/' + id + '/data';
  }

  public uploadFile(id: string, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http
      .put(this.getEndpoint() + '/' + id + '/data', formData, {
        reportProgress: true,
        observe: 'events'
      })
      .pipe(catchError(this.handleErrorAndRethrow('/items', [])));
  }

  public async canUserEditItem(id: string) : Promise<boolean> {
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
      return '/items/' + item.id;
      //return (item.public ? '/public/items/' : '/items/') + item.id;
    } else {
      return '';
    }
  }

  public getLinkedItemId(item: Item): string {
    if (item && item.link && item.link.startsWith('http')) {
      if (item.link.startsWith('https://realnet.io/')) {
        return item.link.slice(25);
      }
    }
    return '';
  }

  isInternalLink(item: Item): boolean {
    return !!item && !!item.link && item.link.startsWith('https://realnet.io/');
  }

  isLink(item: Item): boolean {
    return !!item && 'link' in item && 'link' != null;
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
    if (query.lat && query.lng) {
      result += ' in ' + query.radius + ' m radius around ' + query.lat.toFixed(4) + ', ' + query.lng.toFixed(4);
    }
    return result;
  }

  private getAppsQueryString(apps: [Item]) {
    if (apps && apps.length > 0) {
      return '?parent_id=' + apps[0].id;
    } else {
      return '';
    }
  }

  public apps(): Observable<[Item]> {
    let params = new HttpParams();
    params = params.append('my_items', 'true');
    params = params.append('types', 'Apps');
    
    const httpOptions = {
      params: params
    };

    return this.http.get<[Item]>(this.getAccessibleEndpoint(), httpOptions).pipe(
      mergeMap(apps => this.http.get<[Item]>(this.getAccessibleEndpoint() + this.getAppsQueryString(apps))),
      catchError(this.handleError('/items', []))
    );
  }
}

export class Type {
  id?: string;
  base_id?: string;
  name?: string;
  icon?: string;
  attributes?: {[index: string]:any};
}


export class Item {
  id?: string;
  group_id?: string;
  owner_id?: string;
  parent_id?: string;
  attributes?: {[index: string]:any};
  name?: string;
  location?: string;
  visibility?: string;
  point?: object;
  link?: string;
  type?: Type;
  type_id?: string;
  tags?: string[];
}

export class Query {
  types?: string[];
  tags?: string[];
  name?: string;
  public?: boolean;
  myItems?: boolean;
  parentId?: string;
  lat?: number;
  lng?: number;
  radius?: number;
}
