import { Component, OnInit } from '@angular/core';
import { RnCtrlComponent } from '../rn-ctrl/rn-ctrl.component';
import { FormGroup, FormControl } from '@angular/forms';
import { Item, itemIsInstanceOf } from '../services/item.service';

@Component({
  selector: 'app-rn-form-ctrl',
  templateUrl: './rn-form-ctrl.component.html',
  styleUrls: ['./rn-form-ctrl.component.sass']
})
export class RnFormCtrlComponent extends RnCtrlComponent implements OnInit {

    item_form = new FormGroup({});
    actuators: Item[] = [];

    override ngOnInit(): void {
      if(this.item && this.item.items) {
        let controls: {[index: string]:any} = {};
        for(var control of this.item.items) {

          if(itemIsInstanceOf(control, "Ctrl")) {
            if (control.name) {
              controls[control.name] = new FormControl();
            }
          } else if(itemIsInstanceOf(control, "Actuator")) {
            this.actuators.push(control);
          }
        } 
        this.item_form = new FormGroup(controls);
        }
        
      }
  }

