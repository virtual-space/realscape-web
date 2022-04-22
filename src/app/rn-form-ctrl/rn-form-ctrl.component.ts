import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { RnCtrlComponent } from '../rn-ctrl/rn-ctrl.component';
import { FormGroup, FormControl } from '@angular/forms';
import { Item, ItemEvent, itemIsInstanceOf } from '../services/item.service';

@Component({
  selector: 'app-rn-form-ctrl',
  templateUrl: './rn-form-ctrl.component.html',
  styleUrls: ['./rn-form-ctrl.component.sass']
})
export class RnFormCtrlComponent extends RnCtrlComponent implements OnInit {
    @Input() layout?: string = "column";
    @Input() align?: string = "center center";
    @Input() gap?: string = "1%";
    form_group = new FormGroup({});
    actuators: Item[] = [];
    controls: Item[] = [];

    override ngOnInit(): void {
      this.rebuildControls();
    }

    rebuildControls() {
      this.controls = [];
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
        }
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
        this.rebuildControls();
      }
    }

    getButtons(): Item[] {
      if (this.controls) {
          return this.controls.filter(c => itemIsInstanceOf(c, "ButtonCtrl"));
      }

      return [];
    }

    getControls(): Item[] {
      if (this.controls) {
          return this.controls.filter(c => !itemIsInstanceOf(c, "ButtonCtrl"));
      }

      return [];
    }

    isDefaultButton(item: Item) {
      return item && item.attributes && item.attributes['default'] === 'true';
    }

    isNormalButton(item: Item) {
      return item && item.attributes && item.attributes['default'] !== 'true';
    }
  
    onButtonClick(button: Item) {
      if (this.onEvent) {
        this.onEvent.emit({event: 'click', 
                          item: this.item, 
                          control: button,
                          data: this.form_group.value });
      }
    }

    onEventHandler(event: ItemEvent) {
      this.onEvent.next(event);
    }
  }

