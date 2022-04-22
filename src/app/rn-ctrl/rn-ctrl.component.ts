import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
  @Input() formGroup?: FormGroup;

  formControl = new FormControl('');
  
  constructor(public itemService: ItemService) { }

  ngOnInit(): void {
    if(!this.item) {
      this.item = this.control;
    }

    if(this.formGroup) {
      if(this.control && this.control.name) {
        this.formControl = new FormControl(this.getValue());
        this.formGroup.addControl(this.control.name.toLowerCase(), this.formControl);
      }
    }
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
      if ('value' in this.control.attributes) {
        return this.control.attributes['value'];
      }
      
      if (this.item) {

        if (this.item.attributes && this.control.attributes) {
          if ('target' in this.control.attributes) {
            const target = this.control.attributes['target'];
            if (target in this.item.attributes) {
              return this.item.attributes[target];
            }
          }
        }

        if (this.control.name) {
            const target = this.control.name.toLowerCase();

            if (target === 'name') {
              return this.item.name;
            } else if(this.item && this.item.attributes && target in this.item.attributes) {
              return this.item.attributes[target];
            }
        }
        
      }
    }
  }

}
