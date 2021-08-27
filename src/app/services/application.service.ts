import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {Item, Query} from "./item.service";

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private title = new Subject<string>();
  private name = new Subject<string>();
  private tags = new Subject<string[]>();
  private around = new Subject<boolean>();
  private myItems = new Subject<boolean>();
  private types = new Subject<string[]>();
  private lat = new Subject<number>();
  private lng = new Subject<number>();
  private radius = new Subject<number>();
  private parentId = new Subject<string>();
  private refresh = new Subject<any>();
  private query = new Query();
  private item: Item = null;
  private itemChange = new Subject<Item>();
  private items: Item[] = [];
  private itemsChange = new Subject<Item[]>();

  constructor() {
    this.query.myItems = true;
    this.query.around = true;
    this.query.types = ['Person', 'Place', 'Thing', 'Product', 'Task', 'Event'];
  }

  public setItem(item: Item) {
    console.log('set item');
    this.item = item;
    if (item) {
      this.setParentId(item.id);
    } else {
      this.setParentId(null);
    }
    this.itemChange.next(item);
  }

  public onItemChange(): Observable<Item> {
    return this.itemChange.asObservable();
  }

  public getItem(): Item {
    return this.item;
  }

  public setItems(items: Item[]) {
    console.log('set items');
    this.items = items;
    this.itemsChange.next(items);
  }

  public onItemsChange(): Observable<Item[]> {
    return this.itemsChange.asObservable();
  }

  public getItems(): Item[] {
    return this.items;
  }

  public setTitle(title: string) {
    this.title.next(title);
  }

  public getTitle(): Observable<any> {
    return this.title.asObservable();
  }

  public setName(name: string) {
    this.query.name = name;
    this.name.next(name);
  }

  public getName(): Observable<any> {
    return this.name.asObservable();
  }

  public setTags(tags: string[]) {
    this.query.tags = tags;
    this.tags.next(tags);
  }

  public getTags(): Observable<any> {
    return this.tags.asObservable();
  }

  public setAround(around: boolean) {
    this.query.around = around;
    this.around.next(around);
  }

  public getAround(): Observable<any> {
    return this.around.asObservable();
  }

  public setMyItems(myItems: boolean) {
    this.query.myItems = myItems;
    this.myItems.next(myItems);
  }

  public getMyItems(): Observable<any> {
    return this.myItems.asObservable();
  }

  public setTypes(types: string[]) {
    this.query.types = types;
    this.types.next(types);
  }

  public getTypes(): Observable<any> {
    return this.types.asObservable();
  }

  public setLat(lat: number) {
    this.query.lat = lat;
    this.lat.next(lat);
  }

  public getLat(): Observable<any> {
    return this.lat.asObservable();
  }

  public setLng(lng: number) {
    this.query.lng = lng;
    this.lng.next(lng);
  }

  public getLng(): Observable<any> {
    return this.lng.asObservable();
  }

  public setRadius(radius: number) {
    this.query.radius = radius;
    this.radius.next(radius);
  }

  public getRadius(): Observable<any> {
    return this.radius.asObservable();
  }

  public setParentId(parentId: string) {
    this.query.parentId = parentId;
    this.parentId.next(parentId);
  }

  public getParentId() {
    return this.query.parentId;
  }

  public onParentIdChange(): Observable<any> {
    return this.parentId.asObservable();
  }

  public setRefresh(refresh) {
    this.refresh.next(refresh);
  }

  public getRefresh(): Observable<any> {
    return this.refresh.asObservable();
  }
  public getQuery(): Query {
    return this.query;
  }
}
