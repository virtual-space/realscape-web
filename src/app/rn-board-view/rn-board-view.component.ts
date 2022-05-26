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

  board?: Board;

  override ngOnInit(): void {
    this.rebuildBoard();
  }

  rebuildBoard() {
    const statuses = new Set<string>();
    this.items.forEach(i => {
      if (i.attributes && i.attributes['values']) {
        i.attributes['values'].forEach((ii: string) => {
          statuses.add(ii)
        })
      }
    });
    //console.log('status',statuses);
    const columns: Column[] = [];
    for(let status of statuses) {
      const items: Item[] = this.items.filter(i => i.status === status);
      columns.push(new Column(status, items));
    }
    this.board = new Board(this.item? this.item.name! : 'Board', columns);
    //console.log(this.board)
  }

  drop(event: CdkDragDrop<Item[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      console.log('event',event);
      //this.itemService.update()
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);

      var item = event.container.data[0]
      const columnid = event.container.id
      let columnsplit: any = columnid.split('-')
      const columnIndex: number = +columnsplit[columnsplit.length-1]
      if(this.board && this.board.columns){
        item.status = this.board.columns[columnIndex].name
      }
      if(item && item.id){
        console.log('updating',item.name,'status to',item.status)
        this.itemService.update(item.id,{status: item.status}).subscribe(res => {
          //console.log(res)
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
