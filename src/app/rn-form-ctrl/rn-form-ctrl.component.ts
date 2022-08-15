import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { RnCtrlComponent } from '../rn-ctrl/rn-ctrl.component';
import { FormGroup, FormControl } from '@angular/forms';
import { Item, ItemEvent, itemIsInstanceOf, Query, Type } from '../services/item.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-rn-form-ctrl',
  templateUrl: './rn-form-ctrl.component.html',
  styleUrls: ['./rn-form-ctrl.component.sass']
})
export class RnFormCtrlComponent extends RnCtrlComponent implements OnInit {
    actuators: Item[] = [];
    buttons: Item[] = [];
    views: Item[] = [];
    eventsSubject: Subject<ItemEvent> = new Subject<ItemEvent>();

    override ngOnInit(): void {
      console.log(this);
      if(this.control && this.item) {
        const attrs = this.collectItemAttributes(this.control, {});
        if (attrs && 'query' in attrs) {
          if(attrs['query']) {
            const query = this.getItemQuery(this.item);
            this.item = this.itemFromQuery(query? query : new Query());
            console.log('query:', query, 'item:', this.item);
            //this.itemFromQuery(this.getItemQuery(this.item))
          }
        }
      }
      this.formGroup = new FormGroup({});
      this.controls = this.getControls();
      //console.log(this.controls)
      this.buttons = this.getButtons();
      this.views = [];
      //console.log(this.getItemViews(this.item!));
      //console.log(this.getItemViews(this.control!));
      //this.rebuildControls();
      //this.form_group.setValue(this.item!);
      //console.log(this);
    }

    compare(a: Number, b: Number) {
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      return 0;
    }

    getOrder(item: Item) {
      if (item.attributes) {
        if ('order' in item.attributes) {
          //console.log(item.attributes['order']);
          return parseInt(item.attributes['order']);
        }
      }
      return 99999999;
    }

    rebuildControls() {
      //console.log('*** rebuilding controls ***');
      if(this.control && this.control.items && this.formGroup) {
        const item_controls = this.getControls();  
        for(var control of item_controls.sort(this.getOrder)) {
          //console.log(control);
          if(itemIsInstanceOf(control, "Ctrl")) {
            const field_name = this.getControlAttribute('field_name', this.control.name? this.control.name : 'value');
            if (field_name) {
              //this.formGroup.removeControl(field_name);
              //this.formGroup.addControl(field_name, new FormControl({}));
            }
          } else if(itemIsInstanceOf(control, "Actuator")) {
            this.actuators.push(control);
          } else {
            console.log('item ' + control.name! + ' is not control');
          }
        }
        //console.log(this.formGroup.value)

      }
      //console.log(this.controls);
    }
  
    override itemChanged(item?: Item): void {
      //this.rebuildControls();
    }

    getButtons(): Item[] {
      if (this.control) {
          return this.getItemControls(this.control).filter(c => itemIsInstanceOf(c, "ButtonCtrl"));
      }

      return [];
    }

    getControls(): Item[] {
      if (this.control) {
        return this.getItemControls(this.control).filter(c => !itemIsInstanceOf(c, "ButtonCtrl"));
      }
      return [];
    }

    isDefaultButton(item: Item) {
      const attrs = this.collectItemAttributes(item, {});
      return attrs['default'] === 'true';
    }

    isNormalButton(item: Item) {
      const attrs = this.collectItemAttributes(item, {});
      return attrs['default'] !== 'true';
    }

    override  refreshValue(event: ItemEvent): void {
      //console.log('*** form-ctrl refresh ***');
      this.eventsSubject.next(event);
      this.rebuildControls();
    }

    

    /*
    override onEventHandler(event: ItemEvent) {
      console.log(event, this);
      if (event.event) {
        if (event.event === 'item') {
          this.refreshValue(event);
          //this.controls.forEach(c => c.refreshValue())
          //this.rebuildControls();
        } else if(event.event === 'type') {
          console.log(this);
          this.item = event.item;
          this.refreshValue(event);
          //this.form_group.setValue(this.item!);
          //console.log(this.form_group);
          //this.rebuildControls();
        }
      }
      this.onEvent.next(event);
    }
    */
    onButtonClick(button: Item) {
      console.log(button);
      if (this.onEvent) {
        //console.log(this.form_group);
        this.onEvent.emit({event: 'click', 
                          item: this.item, 
                          control: button,
                          data: this.formGroup!.value });
      }
    }
  }

