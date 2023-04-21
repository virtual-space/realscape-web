import { Component, OnInit, SimpleChanges } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { RnViewComponent } from '../rn-view/rn-view.component';
import { Item } from '../services/item.service';

export class Board {
  constructor(public name: string, public columns: Column[]) {}
}

export class Column {
  constructor(public name: string, public items: Item[]) {}
}

@Component({
  selector: 'app-rn-board-view',
  templateUrl: './rn-board-view.component.html',
  styleUrls: ['./rn-board-view.component.sass']
})
export class RnBoardViewComponent  extends RnViewComponent implements OnInit {

  columns: string[] = [];
  column_items: {[index:string]:Item[]} = {};

  override ngOnInit(): void {
    ////console.log(this);
    this.rebuildBoard();
  }

  rebuildBoard() {
    const statuses = new Set<string>();
    
    //////console.logthis);
    let status_names = ["To Do", "In Progress", "Done", "On Hold"];
    ////console.log('**& status_names_1', status_names);
    if (this.view) {
      const attrs = this.collectItemAttributes(this.view, {});
      if(attrs && 'values' in attrs) {
        status_names = attrs['values'];
      }
    }
    ////console.log('**& status_names_2', status_names);
    let initial_status = status_names[0];
    
    status_names.forEach((ii: string) => {
      statuses.add(ii)
    });
    ////console.log('**& statuses_1', statuses);
    if (this.item && this.item.attributes && this.item.attributes['values']) {
      this.item.attributes['values'].forEach((ii: string) => {
        statuses.add(ii)
      })
    }
    ////console.log('**& statuses_2', statuses);
    this.items.forEach(i => {
      if (i.attributes && i.attributes['values']) {
        i.attributes['values'].forEach((ii: string) => {
          statuses.add(ii)
        })
      }
    });
    ////console.log('**& statuses_3', statuses);
    ////////console.log'status',statuses);
    this.columns = [];
    this.column_items = {};

    for(let status of statuses) {
      //const items: Item[] = this.items.filter(i => i.status === status);
      this.columns.push(status);
      this.column_items[status] = [];
      ////////console.logthis.items.filter(i => i.status === status))
    }
    this.items.forEach(i => {
      if (i.status) {
        //////console.logi);
        //////console.logthis.column_items);
        const column = this.column_items[i.status];
        if (column) {
          column.push(i);
        }
        
      } else {
        i.status = initial_status;
        this.column_items[initial_status].push(i);
      }
    });
    //this.board = new Board(this.item? this.item.name! : 'Board', Object.keys(columns).map((key: string) => columns[key]));
    ////////console.logthis.board)
  }

  drop(event: CdkDragDrop<Item[]>) {
    ////////console.log'event',event);
    if (event.previousContainer === event.container) {
      if (event.previousIndex !== event.currentIndex) {
        const dataCopy = Object.assign({}, event.container.data);
        //////console.log'before',dataCopy);
        //////console.log'moving from ',event.previousIndex, ' to ', event.currentIndex);
        //moveItemInArray(dataCopy, event.previousIndex, event.currentIndex);
        //moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        //////console.log'after',dataCopy);
      }
    } else {
      ////////console.log'event',event);

      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);

      const item = event.item.data;
      const status = event.container.element.nativeElement.getAttribute('data-column-name');
      item.status = status;
      if(item && item.id){
        ////////console.log'updating',item.name,'status to',item.status)
        this.itemService.update(item.id,{status: item.status}).subscribe(res => {
          ////////console.logres)
        });
      }
    }
  }

  override ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.rebuildBoard();
  }

}
