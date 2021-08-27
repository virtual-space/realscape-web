import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';


@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  @Input() name = 'Default';
  @Input() items = [];
  @Output() onRefresh: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  refresh() {
    if (this.onRefresh) {
      this.onRefresh.emit();
    }
  }

}
