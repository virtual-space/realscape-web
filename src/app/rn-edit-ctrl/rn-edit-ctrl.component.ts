import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Item } from '../services/item.service';

@Component({
  selector: 'app-rn-edit-ctrl',
  templateUrl: './rn-edit-ctrl.component.html',
  styleUrls: ['./rn-edit-ctrl.component.sass']
})
export class RnEditCtrlComponent implements OnInit {

  @Input() item?: Item;
  text = new FormControl('')
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
