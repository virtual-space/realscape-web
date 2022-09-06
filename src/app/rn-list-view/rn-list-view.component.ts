import { Component, Input, Output, OnInit, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Item, ItemService } from '../services/item.service';
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from '@angular/material/dialog';
import { RnViewComponent } from '../rn-view/rn-view.component';
import { ItemCallbacks } from '../rn-ctrl/rn-ctrl.component';

@Component({
  selector: 'app-rn-list-view',
  templateUrl: './rn-list-view.component.html',
  styleUrls: ['./rn-list-view.component.sass']
})
export class RnListViewComponent extends RnViewComponent implements ItemCallbacks {

  dataSource = new MatTableDataSource<any>(this.items);
  displayedColumns: string[] = ['icon', 'name', 'tags', 'menu'];

  protected override initialize(): void {
    this.dataSource.data = this.items;
    //////console.log('*************************************** hello from list view initialized!!!');
    //////console.log('item-view init ', this.item);
    this.sessionService.itemActivated$.subscribe(item => {
      this.itemChanged(item);
    });
    this.sessionService.itemsActivated$.subscribe(items => {
      this.itemsChanged(items);
    });
  }

  override itemsChanged(items?: Item[]): void {
    if (items) {
      //////console.log(items);
      this.dataSource.data = items;
    }
    //////console.log('*************************************** hello from list view changed!!!');
  }

}
