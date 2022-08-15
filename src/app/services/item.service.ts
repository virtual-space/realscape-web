import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpEvent, HttpEventType} from "@angular/common/http";
import {Observable, from, of, throwError, scheduled} from "rxjs";
import {catchError, map, concatMap, mergeMap, tap} from 'rxjs/operators';
import {Router} from "@angular/router";
import {Authenticator, AuthService} from "./auth.service";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(protected http: HttpClient,
              protected router: Router,
              protected authService: AuthService) {
    ////console.log('*** constructing item service ***');
  }

  protected getEndpoint() {
    return (environment['api'] || '') + '/items';
  }

  protected getInvokePath(endpoint: string) {
    return (environment['api'] || '') + '/endpoints/' + endpoint + '/invoke';
  }

  protected getHomeEndpoint() {
    return (environment['home'] || '') + '/items';
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
      //console.log(error);
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
    //console.log(params);
    let requestParams = Object.assign({attributes: {types: []} }, params);
    if ('types' in params && params['types'].length > 0) {
      requestParams.attributes.types = Object.assign(requestParams.attributes.types, params.types);
    }
    //console.log(params);
    return this.http.put<Item>(this.getEndpoint() + '/' + id, requestParams).pipe(
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
                  //console.log(`Uploaded! ${uploadProgress}%`);
                  if (progressFn) {
                    progressFn(uploadProgress);
                  }
                  return created;
                }
                case HttpEventType.Response: {
                  //console.log('Successfully uploaded!');
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

  public invoke(endpoint: string, method: any, params: any, progressFn?: (a: number) => void): Observable<Item> {
    return this.http.post<Item>(this.getInvokePath(endpoint), params).pipe(
      mergeMap((invoked: Item) => {
        return of(invoked);
      }),
      catchError(this.handleErrorAndRethrow('/endpoints', []))
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
    ////console.log(query);
    if (query) {
      if (query.name) {
        params = params.append('name', query.name);
      }
      if (query.valid_from) {
        params = params.append('valid_from', query.valid_from.toJSON());
      }
      if (query.valid_to) {
        params = params.append('valid_to', query.valid_to.toJSON());
      }
      if (query.status) {
        params = params.append('status', query.status);
      }
      if (query.parent_id) {
        params = params.append('parent_id', query.parent_id.toString());
      }
      if (query.location) {
        params = params.append('location', JSON.stringify(query.location));
      }
      if (query.types && query.types.length > 0) {
        query.types.forEach(t => {
          params = params.append('types', t);
        });
      }
      if (query.tags && query.tags.length > 0) {
        query.tags.forEach(t => {
          params = params.append('tags', t);
        });
      }
    }
    return params;
  }

  private getParamsFromItem(item: Item): HttpParams {
    let params = new HttpParams();

    if (item.attributes) {
      if ('name' in item.attributes) {
        params = params.append('name', item.attributes['name']);
      }
      if ('parent_id' in item.attributes && item.attributes['parent_id'] !== undefined) {
        params = params.append('parent_id', item.attributes['parent_id']);
      }
      if ('lat' in item.attributes) {
        params = params.append('lat', item.attributes['lat']);
      }
      if ('lng' in item.attributes) {
        params = params.append('lng', item.attributes['lng']);
      }
      if ('radius' in item.attributes) {
        params = params.append('radius', item.attributes['radius']);
      }
      if ('types' in item.attributes) {
        item.attributes['types'].forEach((t:string) => {
          params = params.append('types', t);
        });
      }
      if ('tags' in item.attributes) {
        item.attributes['tags'].forEach((t:string) => {
          params = params.append('tags', t);
        });
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

  public setTypes(types: Type[]) {
    let types_string = localStorage.getItem('types');
    
    if (types_string) {
      const types_data = JSON.parse(types_string);
      const batch_count = types_data['batch_count'];
      const prefix = types_data['prefix'];
      //console.log('removing ',batch_count, 'batches');
      for (let i = 0; i < batch_count; i++) {
        const key = prefix + '_' + i.toString();
        localStorage.removeItem(key);
      }
    }

    localStorage.removeItem('types');

    const batch_size = 1000;
    const prefix =  'types';
    const batch_num = Math.floor(types.length / batch_size) + 1;
    if(batch_num > 0) {
      for (let i = 0; i < batch_num; i++) {
        const key = prefix + '_' + i.toString();
        const batch_entries: Type[] = [];
        for (let j = 0; j < batch_size; j++) {
          const type_index = i * batch_size + j;
          if (type_index < types.length) {
            batch_entries.push(types[type_index]);
          } else {
            break;
          }
        }
        localStorage.setItem(key, JSON.stringify(batch_entries))
      }
      localStorage.setItem('types', JSON.stringify({prefix: prefix, batch_count: batch_num}));
      //console.log({prefix: prefix, batch_count: batch_num});
    }
  }

  public getTypes(): Type[] {
    let types_string = localStorage.getItem('types');
    const types: Type[] = [];
    if (types_string) {
      const types_data = JSON.parse(types_string);
      const batch_count = types_data['batch_count'];
      const prefix = types_data['prefix'];
      for (let i = 0; i < batch_count; i++) {
        const key = prefix + '_' + i.toString();
        let batch = localStorage.getItem(key);
        if(batch) {
          const batch_entries = JSON.parse(batch);
          batch_entries.forEach((be:Type) => {
            types.push(be);
          });
        }
      }
    }
    return types;
  }

  public setApps(apps: Item[]) {
    localStorage.setItem('apps', JSON.stringify(apps));
  }

  public getApps(): Item[] {
    let apps_string = localStorage.getItem('apps');
    if (apps_string) {
      return JSON.parse(apps_string);
    }
    return [];
  }

  public setForms(apps: Item[]) {
    localStorage.setItem('forms', JSON.stringify(apps));
  }

  public getForms(): Item[] {
    let apps_string = localStorage.getItem('forms');
    if (apps_string) {
      return JSON.parse(apps_string);
    }
    return [];
  }

  public setDialogs(dialogs: Item[]) {
    localStorage.setItem('dialogs', JSON.stringify(dialogs));
  }

  public getDialogs(): Item[] {
    let dialogs_string = localStorage.getItem('dialogs');
    if (dialogs_string) {
      return JSON.parse(dialogs_string);
    }
    return [];
  }

  public types(): Observable<[Type]> {
    let url = this.getAccessibleEndpoint(true);
    if (this.authService.isLoggedIn()) {
      url = url + 'types';
    } else {
      url = url + '/public/types';
    }
    return this.http.get<[Type]>(url).pipe(
      catchError(this.handleError('/items', []))
    );
  }

  public forms(): Observable<[Item]> {
    let url = this.getAccessibleEndpoint(true);
    if (this.authService.isLoggedIn()) {
      url = url + 'forms';
    } else {
      url = url + '/public/forms';
    }
    return this.http.get<[Type]>(url).pipe(
      catchError(this.handleError('/forms', []))
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

  
  public importFile(id: string, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http
      .post(this.getEndpoint() + '/' + id + '/import', formData, {
        reportProgress: true,
        observe: 'events'
      })
      .pipe(catchError(this.handleErrorAndRethrow('/items', [])));
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

  public importItems(id: string, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('import', file, file.name);
    return this.http
      .put(this.getEndpoint() + '/import', formData, {
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

  public getItemIcon(item: Item) : string {
    if (item.attributes && 'icon' in item.attributes) {
      return item.attributes['icon'];
    }
    return this.getTypeIcon(item.type!);
  }

  public getTypeIcon(type: Type) : string {
    if (type ) {
      if (type.icon) {
        return type.icon;
      } else if (type.base) {
        return this.getTypeIcon(type.base);
      }
    }
    
    return 'help_center';
  }

  collectTypeAttributes(type: Type, attrs: {[index: string]:any}) {
    let ret = attrs;
    ////console.log('collecting type attributes ', type.name!);
    if (type) {
      if (type.base) {
        attrs = Object.assign(attrs, this.collectTypeAttributes(type.base, attrs));
      }
      if (type.attributes) {
        attrs = Object.assign(attrs, type.attributes);
      }
    }
    
    return ret;
  }

  collectItemAttributes(item: Item, attrs: {[index: string]:any}) {
    let ret = attrs;
    ////console.log('collecting type attributes ', type.name!);
    if (item) {
      ret = this.collectTypeAttributes(item.type!, attrs);
      if(item.attributes) {
        ret = Object.assign(ret, item.attributes);
      }
    }
    
    return ret;
  }


  public getIcon(item: Item): string {
    if(itemIsInstanceOf(item, 'Link') && item.linked_item) {
      return this.getIcon(item.linked_item);
    }

    return this.getItemIcon(item);
  }

  public getLink(item: Item): string {
    const base = this.getHomeEndpoint();
    if(itemIsInstanceOf(item, 'Link') && item.linked_item) {
      return this.getLink(item.linked_item);
    }

    if (itemIsInstanceOf(item,'LoginApp') && item.attributes) {
      return this.authService.getLoginUrl(new Authenticator(item.attributes['authenticator_name'].toString(), 
                                               item.attributes['authenticator_type'].toString(),
                                               item.attributes['client_id'].toString(),
                                               item.attributes['api']!.toString(),
                                               item.attributes['tenant']!.toString()));
    }
    if (item && item.link && item.link.startsWith('http')) {
      if (item.link.startsWith(base)) {
        return item.link.slice(base.length);
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
    const base = this.getHomeEndpoint();
    if(itemIsInstanceOf(item, 'Link') && item.linked_item) {
      return this.getLinkedItemId(item.linked_item);
    }
    if (itemIsInstanceOf(item, 'App')) {
      return item.id!;
    }
    if (item && item.link && item.link.startsWith('http')) {
      if (item.link.startsWith(base)) {
        return item.link.slice(base.length);
      }
    }
    return '';
  }

  isInternalLink(item: Item): boolean {
    const base = this.getHomeEndpoint();
    if(itemIsInstanceOf(item, 'Link') && item.linked_item) {
      return this.isInternalLink(item.linked_item);
    }
    if (itemIsInstanceOf(item, 'LoginApp')) {
      return false;
    }
    if (itemIsInstanceOf(item, 'App')) {
      return true;
    }
    return !!item && !!item.link && item.link.startsWith(base);
  }

  isLink(item: Item): boolean {
    if (itemIsInstanceOf(item, 'App') || itemIsInstanceOf(item, 'Link')) {
      return true;
    }
    return !!item && 'link' in item && 'link' != null;
  }

  getQueryString(query: Query): string {
    let result = 'Show items ';
    //console.log(query);

    if (query.types && query.types.length > 0) {
      result += ' of type ';
      query.types.forEach(t => {
        result += t + ',';
      });
    } else {
      result += ' of any type';
    }
    if (query.name) {
      result += ' named ' + query.name;
    }
    if (query.tags && query.tags.length > 0) {
      result += ' tagged with ';
      query.tags.forEach(t => {
        result += t + ',';
      });
    }
    if (query.location) {
      result += ' in ' + JSON.stringify(query.location);
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
    let path = environment['api']  + '/public/apps';
    if (this.authService.isLoggedIn()) {
      path = environment['api']  + '/apps';
    } 
    return this.http.get<[Item]>(path).pipe(
      catchError(this.handleError('/public/apps', []))
    );
  }

  public dialogs(): Observable<[Item]> {
    let params = new HttpParams();
    params = params.append('my_items', 'true');
    params = params.append('types', 'Dialogs');
    
    const httpOptions = {
      params: params
    };

    return this.http.get<[Item]>(this.getAccessibleEndpoint(), httpOptions).pipe(
      mergeMap(apps => this.http.get<[Item]>(this.getAccessibleEndpoint() + this.getAppsQueryString(apps))),
      catchError(this.handleError('/items', []))
    );
  }

  public search(item: Item): Observable<[Item]> {
    return this.http.get<[Item]>(this.getEndpoint(), { params: this.getParamsFromItem(item) } ).pipe(
      catchError(this.handleError('/items', []))
    );
  }
}

export class Instance {
  id?: string;
  name?: string;
  attributes?: {[index: string]:any};
  type?: Type;
}

export class Type {
  id?: string;
  base_id?: string;
  name?: string;
  icon?: string;
  attributes?: {[index: string]:any};
  instances?: [Instance];
  base?: Type;
  module?: string;
}


export class Item {
  id?: string;
  group_id?: string;
  owner_id?: string;
  parent_id?: string;
  attributes?: {[index: string]:any};
  name?: string;
  location?: any;
  visibility?: string;
  point?: object;
  link?: string;
  type?: Type;
  type_id?: string;
  tags?: string[];
  items?: Item[];
  valid_from?: Date;
  valid_to?: Date;
  status?: string;
  linked_item_id?: string;
  linked_item?: Item;
}
/*
export function getTypeAttributes(type: Type): {[index: string]:any} {
  if (type.attributes) {
    return type.attributes;
  }
  return {};
}

export function buildChildItem(instance: Instance, attributes: {[index: string]:any}): Item {
  const target = new Item();
  target.name = instance.name;
  target.type = instance.type;
  const items:Item[] = []; 
  if (instance.type) {
    if (instance.type.instances) {
      instance.type.instances.forEach(instance => {
          let mergedAttributes = getTypeAttributes(instance.type!);
          if (instance.attributes) {
            mergedAttributes = Object.assign({}, mergedAttributes, instance.attributes)
          }
          items.push(buildChildItem(instance, mergedAttributes));
      });
    }
  }
  target.items = items;
  return target;
}

export function expandItem(item: Item): Item {
  
  if (item.items) {
    return item;
  }

  const target = new Item();
  target.id = item.id;
  target.group_id = item.group_id;
  target.owner_id = item.owner_id;
  target.parent_id = item.parent_id;
  target.attributes = item.attributes;
  target.name = item.name;
  target.location = item.location;
  target.visibility = item.visibility;
  target.point = item.point;
  target.link = item.link;
  target.type = item.type;
  target.type_id = item.type_id;

  const items:Item[] = []; 
  if (target.type) {
    if (target.type.instances) {
      target.type.instances.forEach(instance => {
        items.push(buildChildItem(instance));
      });
    }
  }
  target.items = items;
  return target;
}
*/
export function isInstanceOf(type: Type, type_name: string): boolean {
  
  if (type.name === type_name) {
    ////console.log('*** ', type.name, ' is instance of ', type_name)
    return true;
  }

  if (type.base) {
    return isInstanceOf(type.base, type_name);
  }
  ////console.log('*** ', type.name, ' is NOT an instance of ', type_name)
  return false;
}

export function itemIsInstanceOf(item: Item, type_name: string): boolean {
  if (item.type) {
    return isInstanceOf(item.type, type_name);
  }
  return false;
}

export class Query {
  types?: string[];
  tags?: string[];
  name?: string;
  parent_id?: string;
  location?: any;
  valid_from?: Date;
  valid_to?: Date;
  status?: string;
}

export class ItemEvent {
  event?: string;
  item?: Item;
  control?: Item;
  view?: Item;
  data?: any;
}

export class MenuItem {
  name?: string;
  icon?: string;
  form?: string;
}

