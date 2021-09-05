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
    this.query.types = ['Person', 'Place', 'Thing', 'Product', 'Task', 'Event'];
  }

  public setItems(items: Item[]) {
    console.log('set items');
    this.items = items;
    this.itemsChange.next(items);
  }

  public setTitle(title: string) {
    this.title.next(title);
  }

  public setParentId(parentId: string) {
    this.query.parentId = parentId;
    this.parentId.next(parentId);
  }

  public getQuery(): Query {
    return this.query;
  }
}
