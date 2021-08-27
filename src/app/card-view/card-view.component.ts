import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-card-view',
  templateUrl: './card-view.component.html',
  styleUrls: ['./card-view.component.scss']
})
export class CardViewComponent implements OnInit {
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
