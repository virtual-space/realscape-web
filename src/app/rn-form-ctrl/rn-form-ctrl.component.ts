import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { RnCtrlComponent } from '../rn-ctrl/rn-ctrl.component';
import { FormGroup, FormControl } from '@angular/forms';
import { Item, itemIsInstanceOf } from '../services/item.service';

@Component({
  selector: 'app-rn-form-ctrl',
  templateUrl: './rn-form-ctrl.component.html',
  styleUrls: ['./rn-form-ctrl.component.sass']
})
export class RnFormCtrlComponent extends RnCtrlComponent implements OnInit {
    @Input() layout?: string = "column";
    @Input() align?: string = "center center";
    @Input() gap?: string = "1%";
    item_form = new FormGroup({});
    actuators: Item[] = [];
    controls: Item[] = [];

    override ngOnInit(): void {
      if(this.control && this.control.items) {
        let controls: {[index: string]:any} = {};
        for(var control of this.control.items) {

          if(itemIsInstanceOf(control, "Control")) {
            if (control.name) {
              controls[control.name] = new FormControl();
              this.controls.push(control);
            }
          } else if(itemIsInstanceOf(control, "Actuator")) {
            this.actuators.push(control);
          } else {
            console.log('item ' + control.name! + ' is not control');
          }
        } 
        this.item_form = new FormGroup(controls);
        }
        console.log(this);
        
    }

    getControlAttribute(key: string, def: string, control?: Item): string {
      if(control) {
         if(control.attributes) {
           const ret = control.attributes[key];
           if (ret) {
             return ret;
           }
         }
      } 
  
      return def;
    }
  
    ngOnChanges(changes: SimpleChanges): void {
      if(changes['item']) {
        //console.log('*************************************** hello from ctrl view changed!!!');
        //console.log(this.item);
      }
    }
  
    isButton(item: Item) {
      return itemIsInstanceOf(item, "ButtonCtrl");
    }
  
    isForm(item: Item) {
      return itemIsInstanceOf(item, "FormCtrl");
    }
  }

