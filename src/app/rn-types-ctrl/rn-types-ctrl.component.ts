import { Component, OnInit } from '@angular/core';
import { RnCtrlComponent } from '../rn-ctrl/rn-ctrl.component';
import {COMMA, ENTER, P} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import { FormControl } from '@angular/forms';
import { Item, Type } from '../services/item.service';

@Component({
  selector: 'app-rn-types-ctrl',
  templateUrl: './rn-types-ctrl.component.html',
  styleUrls: ['./rn-types-ctrl.component.sass']
})
export class RnTypesCtrlComponent extends RnCtrlComponent implements OnInit {

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  override ngOnInit(): void {
    this.rebuildTypesControl();
  }

  override itemChanged(item?: Item): void {
    this.rebuildTypesControl();
  }

  rebuildTypesControl() {
    //////////console.log'REBUILD TYPES', this);
    this.formControl.setValue([]);
    if(this.item) {
      this.types = [];
      const allTypes = this.itemService.getTypes();
      const value = this.getValue();
      if(value) {
        value.forEach((v: any) => {
          const target = allTypes.find(t => t.name === v);
          if (target) {
            this.types.push(target);
          }
        });
      }
      //////////console.logthis.types);
      this.formControl.setValue(Array.from(new Set(this.types.map(t => t.name!))));
   }
   if(this.formGroup) {
      if(this.control) {
        const field_name = this.getControlAttribute('field_name', this.control.name? this.control.name : 'value');
        //////////console.log'edit_ctrl', field_name);
        this.formGroup.removeControl(field_name);
        this.formGroup.addControl(field_name, this.formControl);
        //////////console.log'*** rebuild types control ***', this.formGroup);
      }
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our type
    if (value) {
      const allTypes = this.itemService.getTypes();
      const target = allTypes.find(t => t.name === value);
      if(target) {
        this.types.push(target);
        if (this.item) {
          this.setValue(this.types.map(t => t.name));
        }
        this.formControl.setValue(this.types.map(t => t.name));
      }
    }
    
    //////////console.logthis.formControl.value);
    // Clear the input value
    event.chipInput!.clear();
  }

  remove(type: Type): void {
    const index = this.types.indexOf(type);

    if (index >= 0) {
      this.types.splice(index, 1);
    }
    if (this.item) {
      if(this.item.attributes) {
        this.item.attributes['types'] = this.types.map(t => t.name);
      }
    }
    this.formControl.setValue(this.types.map(t => t.name));
    //////////console.logthis.formControl.value);
  }

}
