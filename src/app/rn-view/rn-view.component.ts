import { Component, OnInit, Input } from '@angular/core';
import { Item } from '../services/item.service';

@Component({
  selector: 'app-rn-view',
  templateUrl: './rn-view.component.html',
  styleUrls: ['./rn-view.component.sass']
})
export class RnViewComponent implements OnInit {

  @Input() view?: Item;
  @Input() items: Item[] = [];

  public isControl: boolean = false;
  constructor() { }

  ngOnInit(): void {
    console.log(this.view);
    if (this.view) {
      if (this.view.type) {
        if (this.view.type.base) {
          if (this.view.type.base.name) {
            if (this.view.type.base.name === "CtrlView") {
              this.isControl = true;
            }
          }
        }
      }
    }
  }

}
