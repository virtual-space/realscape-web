import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {ItemService} from "../services/item.service";

@Component({
  selector: 'app-board-view',
  templateUrl: './board-view.component.html',
  styleUrls: ['./board-view.component.scss']
})
export class BoardViewComponent implements OnInit {

  @Input() columns = [{name: 'To do', status: 'new'}, {name: 'In progress', status: 'working'}, {name: 'Done', status: 'done'}];
  @Output() onRefresh: EventEmitter<any> = new EventEmitter();

  tasks = {};

  constructor(private itemService: ItemService) { }

  ngOnInit() {
  }

  @Input('items')
  set items(val) {
    this.tasks = {};
    this.populateTasks(val);
    //this.tasks = val.filter(i => i.status);
  }

  drop(event: CdkDragDrop<any>) {
    console.log(event);
    if (event.previousContainer === event.container) {
      moveItemInArray(this.tasks[event.container.data], event.previousIndex, event.currentIndex);
      const item = this.tasks[event.container.data][event.currentIndex];
      this.itemService.update(item.id, {order: event.currentIndex}).subscribe(e => {
        if (this.onRefresh) {
          this.onRefresh.emit();
        }
      });
    } else {
      transferArrayItem(this.tasks[event.previousContainer.data],
        this.tasks[event.container.data],
        event.previousIndex,
        event.currentIndex);
      const item = this.tasks[event.container.data][event.currentIndex];
      this.itemService.update(item.id, {status: event.container.data, order: event.currentIndex}).subscribe(e => {
        if (this.onRefresh) {
          this.onRefresh.emit();
        }
      });
    }
  }

  populateTasks(items) {
    const a = {};
    this.columns.forEach(c => {
      a[c.status] = [];
      const foundItems = items.filter(i => i.status === c.status);
      foundItems.forEach(i => {
        a[c.status].push(i);
      });
      a[c.status].sort((f, s) => (f.order > s.order) ? -1 : 1);
    });
    this.tasks = a;
    console.log(this.tasks);
  }

}
