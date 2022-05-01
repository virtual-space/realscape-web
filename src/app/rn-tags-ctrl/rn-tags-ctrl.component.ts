import { Component, OnInit } from '@angular/core';
import { RnCtrlComponent } from '../rn-ctrl/rn-ctrl.component';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import { FormControl } from '@angular/forms';

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


  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.tags.push({name: value});
    }
    this.formControl.setValue(this.tags.map(t => t.name));
    //console.log(this.formControl.value);
    // Clear the input value
    event.chipInput!.clear();
  }

  remove(tag: Tag): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
    this.formControl.setValue(this.tags.map(t => t.name));
    //console.log(this.formControl.value);
  }

  protected  override initialize(): void {
    if (this.item && this.item.tags) {
      for(let t of this.item.tags) {
        this.tags.push({name: t});
      }
    }
    this.formControl.setValue(this.tags.map(t => t.name));
    //console.log(this.formControl);
  }

}
