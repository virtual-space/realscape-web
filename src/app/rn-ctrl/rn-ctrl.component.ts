import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Item, ItemEvent, ItemService } from '../services/item.service';

@Component({
  selector: 'app-rn-ctrl',
  templateUrl: './rn-ctrl.component.html',
  styleUrls: ['./rn-ctrl.component.sass']
})
export class RnCtrlComponent implements OnInit {
  @Input() item?: Item;
  @Input() control?: Item;
  @Output() onEvent = new EventEmitter<ItemEvent>();
  
  constructor(public itemService: ItemService) { }

  ngOnInit(): void {
    if(!this.item) {
      this.item = this.control;
    }
    //console.log(this.item);
  }

  public getAttribute(key: string, def: string): string {
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

  getValue() {
    if (this.control && this.control.attributes) {
      if (this.item && this.item.attributes) {
        if (this.control.attributes) {
          if ('target' in this.control.attributes) {
            const target = this.control.attributes['target'];
            if (target in this.item.attributes) {
              return this.item.attributes[target];
            }
          }
        }
        
      }
      if ('value' in this.control.attributes) {
        console.log('*** 5 ***');
        return this.control.attributes['value'];
      }
    }
  }

}
