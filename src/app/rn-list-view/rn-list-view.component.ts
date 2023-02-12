import { Component, Input, Output, OnInit, EventEmitter, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Item, ItemService } from '../services/item.service';
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from '@angular/material/dialog';
import { RnViewComponent } from '../rn-view/rn-view.component';
import { ItemCallbacks } from '../rn-ctrl/rn-ctrl.component';
import { MatSort, Sort } from '@angular/material/sort';

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
export class RnListViewComponent extends RnViewComponent implements ItemCallbacks, OnInit {

  dataSource = new MatTableDataSource<any>(this.items);

  @ViewChild(MatSort)
  private sort: MatSort = new MatSort;

  /*
  override ngOnInit() {
    //console.log('*************************************** hello from list view on init!!!');
    this.dataSource.sort = this.sort;

    const sortState: Sort = {
      active: 'name', 
      direction: 'asc'
    };
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    this.sort.sortChange.emit(sortState);
  }*/
  //displayedColumns: string[] = ['icon', 'name', 'tags', 'menu'];
/*
  columns = [
    { columnDef: 'position', header: 'No.',    cell: (element: any) => `${element.position}` },
    { columnDef: 'name',     header: 'Name',   cell: (element: any) => `${element.name}`     },
    { columnDef: 'weight',   header: 'Weight', cell: (element: any) => `${element.weight}`   },
    { columnDef: 'symbol',   header: 'Symbol', cell: (element: any) => `${element.symbol}`   },
  ];
*/
  base_columns = [
    { columnDef: 'icon', header: 'Icon.', type: 'icon',   cell: (element: any) => `${element.attributes.icon}` },
    { columnDef: 'name',     header: 'Name',  type: 'name', cell: (element: any) => `${this.extractValue(element, 'name')}`     },
    { columnDef: 'menu',   header: 'menu', type: 'menu', cell: (element: any) => `${element}`   },
   /* { columnDef: 'tags',   header: 'Weight', cell: (element: any) => `${element.weight}`   },
    { columnDef: 'menu',   header: 'Symbol', cell: (element: any) => `${element.symbol}`   },*/
  ];

  columns = this.base_columns;

  displayedColumns  = this.columns.map(c => c.columnDef);

  protected override initialize(): void {

    const sortState: Sort = {
      active: 'name', 
      direction: 'asc'
    };
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    this.sort.sortChange.emit(sortState);

    this.dataSource.data = this.items;
    ////console.log('*************************************** hello from list view initialized!!!');
    ////console.log'list-view init item:', this.item);
    ////console.log'list-view init control:', this.control);
    ////console.log'list-view init view:', this.view);
    let cols = this.getColumns();
    cols = cols.filter(c => c.target !== 'name');
    if(cols.length > 0) {
      //console.log'list-view columns:', cols);
      let c1 = cols.filter(c => c.target !== 'name')
      this.columns = this.base_columns.concat(cols.map(c => { return {columnDef: c.target!, header: c.name!, type: c.target!, cell: (element:any) => `${this.extractValue(element,c.target!)}`} }));
      this.displayedColumns  = this.columns.map(c => c.columnDef);
      
    }
    this.sessionService.itemActivated$.subscribe(item => {
      this.itemChanged(item);
    });
    this.sessionService.itemsActivated$.subscribe(items => {
      this.itemsChanged(items);
    });
  }

  extractValue(element: any, type: string) {
    
    if(element) {
      if(type) {
        ////console.logtype);
        if(type === 'name') {
          ////console.log'hasname');
          return element.name;
        }
        else if (type === 'valid_from') {
          return  element.valid_from;
        }
        else if (type === 'valid_to') {
          return  element.valid_to;
        }
        else if (type === 'status') {
          return  element.status;
        }
        else  {
          return  element['attributes'][type]
        }
      }
      return element;
    }
    return null;
  }

  override itemsChanged(items?: Item[]): void {
    if (items) {
      ////////console.logitems);
      this.dataSource.data = items;
    }
    ////////console.log'*************************************** hello from list view changed!!!');
  }

  getColumns(): ListColumn[] {
    ////console.log(this.view)
    if (this.view && this.view.attributes) {
        if ('columns' in this.view.attributes) {
          return this.view.attributes['columns'];
        }
    }
    return []
  }

}
