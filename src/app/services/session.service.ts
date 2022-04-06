import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Item } from './item.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  // Observable Item sources
  private itemActivatedSource = new Subject<Item>();
  private refreshSource = new Subject();

  // Observable Item streams
  itemActivated$ = this.itemActivatedSource.asObservable();
  refreshed$ = this.refreshSource.asObservable();

  // Service message commands
  activateItem(item: Item) {
    this.itemActivatedSource.next(item);
  }

  refresh() {
    this.refreshSource.next(null);
  }
}
