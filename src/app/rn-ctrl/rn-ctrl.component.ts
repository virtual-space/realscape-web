import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../services/item.service';

@Component({
  selector: 'app-rn-ctrl',
  templateUrl: './rn-ctrl.component.html',
  styleUrls: ['./rn-ctrl.component.sass']
})
export class RnCtrlComponent implements OnInit {
  @Input() item?: Item;
  constructor() { }

  ngOnInit(): void {
  }

  getAttribute(key: string, def: string): string {
    if(this.item) {
       if(this.item.attributes) {
         const ret = this.item.attributes[key];
         if (ret) {
           return ret;
         }
       }
    } 

    return def;
  }

}
