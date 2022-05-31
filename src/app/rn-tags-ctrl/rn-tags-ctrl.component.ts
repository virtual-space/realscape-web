import { Component, OnInit } from '@angular/core';
import { RnCtrlComponent } from '../rn-ctrl/rn-ctrl.component';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import { FormControl } from '@angular/forms';
import { Item } from '../services/item.service';

export interface Tag {
  name: string;
}

@Component({
  selector: 'app-rn-tags-ctrl',
  templateUrl: './rn-tags-ctrl.component.html',
  styleUrls: ['./rn-tags-ctrl.component.sass']
})
export class RnTagsCtrlComponent extends RnCtrlComponent implements OnInit {
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  tags: Tag[] = [];

  override ngOnInit(): void {
    this.rebuildTagsControl();
  }

  override itemChanged(item?: Item): void {
    this.rebuildTagsControl();
  }

  rebuildTagsControl() {
    this.formControl.setValue([]);
    if(this.item) {
      this.tags = [];
      const value = this.getValue();
      if(value) {
        value.forEach((v: any) => {
          this.tags.push({name: v});
        });
      }
      this.formControl.setValue(Array.from(new Set(this.tags.map(t => t.name))));
   }
   if(this.formGroup) {
      if(this.control) {
        const field_name = this.getControlAttribute('field_name', this.control.name? this.control.name : 'value');
        ////console.log('edit_ctrl', field_name);
        this.formGroup.removeControl(field_name);
        this.formGroup.addControl(field_name, this.formControl);
        ////console.log('*** rebuild types control ***', this.formGroup);
      }
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.tags.push({name: value});
    }

    if (this.item) {
        if(this.item.attributes) {
          this.item.attributes['tags'] = this.tags.map(t => t.name);
        }
    }

    this.formControl.setValue(this.tags.map(t => t.name));
    ////console.log(this.formControl.value);
    // Clear the input value
    event.chipInput!.clear();
  }

  remove(tag: Tag): void {
    const index = this.tags.indexOf(tag);
    //console.log(index);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
    if (this.item) {
      if(this.item.attributes) {
        this.item.attributes['tags'] = this.tags.map(t => t.name);
      }
    }
    this.formControl.setValue(this.tags.map(t => t.name));
    ////console.log(this.formControl.value);
  }

}
