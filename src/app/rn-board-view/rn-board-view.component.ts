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

  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  columns: string[] = [];
  column_items: {[index:string]:Item[]} = {};

  override ngOnInit(): void {
    this.rebuildBoard();
  }

  rebuildBoard() {
    const statuses = new Set<string>();

    ["To Do", "In Progress", "Done", "On Hold"].forEach((ii: string) => {
      statuses.add(ii)
    });

    if (this.item && this.item.attributes && this.item.attributes['values']) {
      this.item.attributes['values'].forEach((ii: string) => {
        statuses.add(ii)
      })
    }

    this.items.forEach(i => {
      if (i.attributes && i.attributes['values']) {
        i.attributes['values'].forEach((ii: string) => {
          statuses.add(ii)
        })
      }
    });

    //console.log('status',statuses);
    this.columns = [];
    this.column_items = {};

    for(let status of statuses) {
      //const items: Item[] = this.items.filter(i => i.status === status);
      this.columns.push(status);
      this.column_items[status] = [];
      //console.log(this.items.filter(i => i.status === status))
    }
    this.items.forEach(i => {
      if (i.status) {
        this.column_items[i.status].push(i);
      } else {
        i.status = "To Do";
        this.column_items["To Do"].push(i);
      }
    });
    //this.board = new Board(this.item? this.item.name! : 'Board', Object.keys(columns).map((key: string) => columns[key]));
    //console.log(this.board)
  }

  drop1(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  drop(event: CdkDragDrop<Item[]>) {
    console.log('event',event);
    if (event.previousContainer === event.container) {
      if (event.previousIndex !== event.currentIndex) {
        const dataCopy = Object.assign({}, event.container.data);
        console.log('before',dataCopy);
        console.log('moving from ',event.previousIndex, ' to ', event.currentIndex);
        //moveItemInArray(dataCopy, event.previousIndex, event.currentIndex);
        //moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        console.log('after',dataCopy);
      }
    } else {
      console.log('event',event);
      //this.itemService.update()
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
        
      //event.container[currentIndex] is where the item is being dropped to
      //event.previousContainer[previousIndex] is where the item is being dropped to
      var item = event.item.data;
      console.log(item);
      const columnid = event.container.id
      console.log(columnid);
      let columnsplit: any = columnid.split('-')
      const columnIndex: number = +columnsplit[columnsplit.length-1]
      item.status = this.columns[columnIndex];
      if(item && item.id){
        console.log('updating',item.name,'status to',item.status)
        this.itemService.update(item.id,{status: item.status}).subscribe(res => {
          console.log(res)
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
