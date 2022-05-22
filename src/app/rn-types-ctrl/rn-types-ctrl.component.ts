import { Component, OnInit } from '@angular/core';
import { RnCtrlComponent } from '../rn-ctrl/rn-ctrl.component';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import { FormControl } from '@angular/forms';
import { Type } from '../services/item.service';

@Component({
  selector: 'app-rn-types-ctrl',
  templateUrl: './rn-types-ctrl.component.html',
  styleUrls: ['./rn-types-ctrl.component.sass']
})
export class RnTypesCtrlComponent extends RnCtrlComponent implements OnInit {

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  types: Type[] = [];


  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our type
    if (value) {
      const allTypes = this.itemService.getTypes();
      const target = allTypes.find(t => t.name === value);
      if(target) {
        this.types.push({name: value});
        this.formControl.setValue(this.types.map(t => t.name));
      }
    }
    
    //console.log(this.formControl.value);
    // Clear the input value
    event.chipInput!.clear();
  }

  remove(type: Type): void {
    const index = this.types.indexOf(type);

    if (index >= 0) {
      this.types.splice(index, 1);
    }
    this.formControl.setValue(this.types.map(t => t.name));
    //console.log(this.formControl.value);
  }

  protected  override initialize(): void {
    
    console.log(this);
    if (this.item) {
      //const names = new Set(this.getItemTypes(this.item).map(t => t.name!));
      //const allTypes = this.itemService.getTypes();
      //this.formControl.setValue(allTypes.filter(t => names.has(t.name!)));
      this.types = this.getItemTypes(this.item);
      this.formControl.setValue(Array.from(new Set(this.types.map(t => t.name!))));
    }
    console.log(this.formControl);
  }

}
