import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Item, ItemEvent, ItemService, Type } from '../services/item.service';

@Component({
  selector: 'app-rn-ctrl',
  templateUrl: './rn-ctrl.component.html',
  styleUrls: ['./rn-ctrl.component.sass']
})
export class RnCtrlComponent implements OnInit {
  @Input() item?: Item;
  @Input() control?: Item;
  @Output() onEvent = new EventEmitter<ItemEvent>();
  @Input() events?: Observable<number>;
  @Input() formGroup?: FormGroup;
  @Input() fieldName?: string;
  @Input() tabIndex?: number;
  

  formControl = new FormControl('');
  
  constructor(public itemService: ItemService,
              protected dialog: MatDialog,) { }

  ngOnInit(): void {
    if(!this.item) {
      this.item = this.control;
    }

    if(this.formGroup) {
      //console.log(this.control);
      if(this.control) {
        let field_name = this.fieldName? this.fieldName.toLowerCase() : this.getAttribute(this.control, 'field_name', '').toLowerCase();
        //console.log(field_name);
        if(field_name === '' && this.control && this.control.name) {
          field_name = this.control.name.toLowerCase();
        }
        if (field_name === 'tags') {
          this.formControl = new FormControl([]);
        } else {
          //const val = this.getValue();
          //console.log(val);
          this.formControl = new FormControl(this.getValue());
        }
        this.formGroup.addControl(field_name, this.formControl);
        //console.log(field_name, this.formControl);
      }
    }

    this.initialize();
  }

  protected initialize() {}

  collectTypeAttributes(type: Type, attrs: {[index: string]:any}) {
    let ret = attrs;
    //console.log('collecting type attributes ', type.name!);
    if (type) {
      if (type.base) {
        attrs = Object.assign(attrs, this.collectTypeAttributes(type.base, attrs));
      }
      if (type.attributes) {
        attrs = Object.assign(attrs, type.attributes);
      }
    }
    
    return ret;
  }

  public getAttribute(item: Item, key: string, def: string): string {
    const attributes = this.collectTypeAttributes(item.type!, item.attributes? item.attributes : {});
    if(attributes) {
      const ret = attributes[key];
      if (ret) {
        return ret;
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
            //console.log('target is ', target);
            if (target === "valid_from") {
              return this.item.valid_from;
            } else if (target === "valid_to") {
              return this.item.valid_to;
            } else if (target === "name") {
              return this.item.name;
            } else if (target === "location") {
              return this.item.location? JSON.stringify(this.item.location) : undefined;
            }else if (target === "status") {
              return this.item.status;
            } else if (target === "tags") {
              return this.item.tags? this.item.tags : [];
            }
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
