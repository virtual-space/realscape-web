import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { RnCtrlComponent } from '../rn-ctrl/rn-ctrl.component';
import { FormGroup, FormControl } from '@angular/forms';
import { Item, ItemEvent, itemIsInstanceOf, Query, Type } from '../services/item.service';
import { Subject } from 'rxjs';
import { EventEmitter } from 'stream';

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
    typeForms?: {[index: string]:any};
    typeForm?: Item;
    embedded: boolean = false;
    activeItem?: Item;

    
    override initialize(): void {
      //console.log(this);
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
        if (attrs && 'form' in attrs) {
          console.log(attrs['form']);
        }
      }
      if (!this.formGroup) {
        this.formGroup = new FormGroup({});
      }
      this.controls = this.getControls();
      //this.onTypeHandlerCtrl = this.onTypeHandlerCtrl;
      //console.log(this.controls)
      this.buttons = this.getButtons();

      this.typeForms = this.getTypeForms(this.item!.type!);
      this.typeForm = this.getTypeForm(this.item!.type!, 'edit');

      if(!this.formItem) {
        this.formItem = this.control;
      }
      //this.views = [];
      //console.log(this.getItemViews(this.item!));
      //console.log(this.getItemViews(this.control!));
      //this.rebuildControls();
      //this.form_group.setValue(this.item!);
      console.log(this);
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
      console.log('*** item changed ***');
      //this.rebuildControls();
    }

    getButtons(): Item[] {
      //console.log('&&& 1');
      if (this.control) {
        //console.log('&&& 2');
        //console.log(this.control);
        let buttons = this.getItemControls(this.control).filter(c => itemIsInstanceOf(c, "ButtonCtrl"));
        //console.log(buttons);
        if (itemIsInstanceOf(this.control, "Form"))
        {
          const control_attrs = this.collectItemAttributes(this.control, {});
          const source = control_attrs['source'];
          const form_type = control_attrs['form_type'];
          if (source === "item" && this.item) {
            //console.log(buttons);
            return buttons.concat(this.getItemFormControls(this.item, form_type).filter(c => itemIsInstanceOf(c, "ButtonCtrl")));
          }
          //console.log(buttons);
        } else if (itemIsInstanceOf(this.control, "FormCtrl")) {
          
          const control_attrs = this.collectItemAttributes(this.control, {});
          const form = control_attrs['form'];
          console.log('form_ctrl form:', form);
          const forms = this.itemService.getForms();
          ////console.log(dialogs);
          if (forms) {
            const f = forms.find(d => d.name === form);
            if (f) {
              buttons = buttons.concat(this.getItemControls(f).filter(c => itemIsInstanceOf(c, "ButtonCtrl")));
            }
          }
        }
        return buttons;
      }

      return [];
    }

    getControls(): Item[] {
      /*
      console.log("form control:",this.control);
      console.log("form item:",this.item);
      console.log("form active item:", this.activeItem);
      return [];
      */
      
      let ctrls: Item[] = [];
      console.log("form control:",this.control);
      console.log("form item:",this.item);
      console.log("form active item:", this.activeItem);
      if (this.control) {
        ctrls = this.getItemControls(this.control).filter(c => !itemIsInstanceOf(c, "ButtonCtrl"));
        console.log(ctrls);
        //if this is a form control that should source this from item attributes menu
        if (itemIsInstanceOf(this.control, "Form"))
        {
          //console.log('formcontrol')
          const control_attrs = this.collectItemAttributes(this.control, {});
          const source = control_attrs['source'];
          let form_type = control_attrs['form_type'];
          if (!form_type) {
            form_type = 'create';
          }
          if (source === "item" && this.item) {
            ctrls = ctrls.concat(this.getItemFormControls(this.item, form_type).filter(c => !itemIsInstanceOf(c, "ButtonCtrl")));
          }
          
        } else if (itemIsInstanceOf(this.control, "FormCtrl")) {
          
          const control_attrs = this.collectItemAttributes(this.control, {});
          const form = control_attrs['form'];
          console.log('form_ctrl form:', form);
          const forms = this.itemService.getForms();
          ////console.log(dialogs);
          if (forms) {
            const f = forms.find(d => d.name === form);
            if (f) {
              ctrls = ctrls.concat(this.getItemControls(f).filter(c => !itemIsInstanceOf(c, "ButtonCtrl")));
            }
          }
        }
        //console.log(ctrls);
        return ctrls;
      }
      return ctrls;
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
      console.log('*** form-ctrl refresh ***');
      this.eventsSubject.next(event);
      this.rebuildControls();
    }

    override TypeChangedEventHandler(type: Type): void {
      console.log('*** right hadnler ***')
    }

    selectedTypeChanged(type: Type) {
      this.formType = type;
      this.typeForms = this.getTypeForms(type);
      this.typeForm = this.getTypeForm(type, 'create');
      this.formGroup = new FormGroup({});
      this.controls = this.getControls();
      //this.onTypeHandlerCtrl = this.onTypeHandlerCtrl;
      //console.log(this.controls)
      this.buttons = this.getButtons();
      this.views = [];
      //this.controls = this.getControls();
      //this.buttons = this.getButtons();
      //this.views = [];
      //console.log(this)
      //console.log(type);
    }

    initialTypeAssigned(type: Type) {
      console.log('initial_type_set:', type);
      this.formType = type;
      this.typeForms = this.getTypeForms(type);
      this.typeForm = this.getTypeForm(type, 'create');
    }

    getForm(form_name: string) {
      if (this.formType && this.typeForms) {
        return this.typeForms[form_name]
      }
      return undefined;
    }

    /*
    override onEventHandler(event: ItemEvent) {
      console.log(event, this);
    }*/
    /*
    override onTypeHandlerCtrl(type: Type): void {
      console.log('***form:',type);
    }*/
    

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

