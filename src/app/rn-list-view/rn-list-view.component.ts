import { Component, Input, Output, OnInit, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Item, ItemService } from '../services/item.service';
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from '@angular/material/dialog';
import { RnViewComponent } from '../rn-view/rn-view.component';
import { ItemCallbacks } from '../rn-ctrl/rn-ctrl.component';

export class ListColumn {
  name?: string;
  namespace?: string;
  target?: string;
}

@Component({
  selector: 'app-rn-list-view',
  templateUrl: './rn-list-view.component.html',
  styleUrls: ['./rn-list-view.component.sass']
})
export class RnListViewComponent extends RnViewComponent implements ItemCallbacks {

  dataSource = new MatTableDataSource<any>(this.items);
  //displayedColumns: string[] = ['icon', 'name', 'tags', 'menu'];
/*
  columns = [
    { columnDef: 'position', header: 'No.',    cell: (element: any) => `${element.position}` },
    { columnDef: 'name',     header: 'Name',   cell: (element: any) => `${element.name}`     },
    { columnDef: 'weight',   header: 'Weight', cell: (element: any) => `${element.weight}`   },
    { columnDef: 'symbol',   header: 'Symbol', cell: (element: any) => `${element.symbol}`   },
  ];
*/
  columns = [
    { columnDef: 'icon', header: 'Icon.', type: 'icon',   cell: (element: any) => `${element.attributes.icon}` },
    { columnDef: 'name',     header: 'Name',  type: 'string', cell: (element: any) => `${element.name}`     },
    { columnDef: 'menu',   header: 'menu', type: 'menu', cell: (element: any) => `${element}`   },
   /* { columnDef: 'tags',   header: 'Weight', cell: (element: any) => `${element.weight}`   },
    { columnDef: 'menu',   header: 'Symbol', cell: (element: any) => `${element.symbol}`   },*/
  ];

  displayedColumns  = this.columns.map(c => c.columnDef);

  protected override initialize(): void {
    this.dataSource.data = this.items;
    //////console.log('*************************************** hello from list view initialized!!!');
    //console.log('list-view init item:', this.item);
    //console.log('list-view init control:', this.control);
    //console.log('list-view init view:', this.view);
    console.log('list-view columns:', this.getColumns());
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

  getColumns(): ListColumn[] {
    console.log(this.view)
    if (this.view && this.view.attributes) {
        if ('columns' in this.view.attributes) {
          return this.view.attributes['columns'];
        }
    }
    return []
  }

}
