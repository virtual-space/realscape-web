import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Item } from './item.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  // Observable Item sources
  private itemsActivatedSource = new Subject<Item[] | undefined>();
  private itemActivatedSource = new Subject<Item>();
  private refreshSource = new Subject();

  // Observable Item streams
  itemsActivated$ = this.itemsActivatedSource.asObservable();
  itemActivated$ = this.itemActivatedSource.asObservable();
  refreshed$ = this.refreshSource.asObservable();

  // Service message commands
  activateItems(items?: Item[]) {
    this.itemsActivatedSource.next(items);
  }

  activateItem(item: Item) {
    this.itemActivatedSource.next(item);
  }

  refresh() {
    this.refreshSource.next(null);
  }
}
