import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RnViewComponent } from '../rn-view/rn-view.component';

@Component({
  selector: 'app-rn-attributes-view',
  templateUrl: './rn-attributes-view.component.html',
  styleUrls: ['./rn-attributes-view.component.sass']
})
export class RnAttributesViewComponent  extends RnViewComponent implements OnInit {

  dataSource = new MatTableDataSource<any>([]);

  base_columns = [
    { columnDef: 'icon', header: 'Icon.', type: 'icon',   cell: (element: any) => `${element.attributes.icon}` },
    { columnDef: 'name',     header: 'Name',  type: 'name', cell: (element: any) => `${this.extractValue(element, 'name')}`     },
    { columnDef: 'menu',   header: 'menu', type: 'menu', cell: (element: any) => `${element}`   },
   /* { columnDef: 'tags',   header: 'Weight', cell: (element: any) => `${element.weight}`   },
    { columnDef: 'menu',   header: 'Symbol', cell: (element: any) => `${element.symbol}`   },*/
  ];

  columns = this.base_columns;

  displayedColumns  = this.columns.map(c => c.columnDef);

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

}
