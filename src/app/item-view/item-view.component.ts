import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Item, ItemService} from "../services/item.service";
import {Subject} from "rxjs";

@Component({
  selector: 'app-item-view',
  templateUrl: './item-view.component.html',
  styleUrls: ['./item-view.component.scss']
})
export class ItemViewComponent implements OnInit {
  @Input() view = null;
  @Input() item: Item = null;
  @Input() items = [];
  @Input() loading = false;

  @Output() onRefresh: EventEmitter<any> = new EventEmitter();
  @Output() onAdd: EventEmitter<any> = new EventEmitter();
  @Output() centerChanged = new EventEmitter<any>();

  paginatorSize = 20;
  numberOfProductsDisplayedInPage = 20;

  @Input('activeTab')
  set activeTab(val) {
    console.log('activeTab: ' + val);
    this.eventsSubject.next();
  }

  eventsSubject: Subject<void> = new Subject<void>();
  panelOpenState = false;

  constructor(private itemService: ItemService) { }

  ngOnInit() {
    this.itemService.children(this.item.id).subscribe(children => {
      this.items = children
    });
  }

  refresh() {
    if (this.onRefresh) {
      this.onRefresh.emit();
    }
  }

  onCenterChanged(event) {
    if(this.centerChanged) {
      this.centerChanged.emit(event);
    }
  }

  add(event) {
    if (this.onAdd) {
      this.onAdd.emit(event);
    }
  }

  updateProductsDisplayedInPage($event) {

  }
}
