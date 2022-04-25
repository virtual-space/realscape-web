import { Component, Input, Output, OnInit, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Item, ItemService } from '../services/item.service';
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from '@angular/material/dialog';
import { RnViewComponent } from '../rn-view/rn-view.component';

@Component({
  selector: 'app-rn-list-view',
  templateUrl: './rn-list-view.component.html',
  styleUrls: ['./rn-list-view.component.sass']
})
export class RnListViewComponent extends RnViewComponent implements OnInit, OnChanges {

  dataSource = new MatTableDataSource<any>(this.items);
  displayedColumns: string[] = ['icon', 'name', 'tags', 'menu'];

  override ngOnInit() {
    console.log(this.items);
    this.dataSource.data = this.items;
  }

  override ngOnChanges(changes: SimpleChanges): void {
    if(changes['items']) {
      this.dataSource.data = this.items;
    }
  }

}
