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

    if (value) {
      this.tags.push({name: value});
    }

    if (this.item) {
        if(this.item.attributes) {
          this.item.attributes['tags'] = this.tags.map(t => t.name);
        }
    }

    this.formControl.setValue(this.tags.map(t => t.name));
    //console.log(this.formControl.value);
    // Clear the input value
    event.chipInput!.clear();
  }

  remove(tag: Tag): void {
    const index = this.tags.indexOf(tag);
    console.log(index);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
    if (this.item) {
      if(this.item.attributes) {
        this.item.attributes['tags'] = this.tags.map(t => t.name);
      }
    }
    this.formControl.setValue(this.tags.map(t => t.name));
    //console.log(this.formControl.value);
  }

  protected  override initialize(): void {
    console.log('tags-ctrl', this.item);
    if (this.item && this.item.attributes && 'tags' in this.item.attributes) {
      //const names = new Set(this.getItemTypes(this.item).map(t => t.name!));
      //const allTypes = this.itemService.getTypes();
      //this.formControl.setValue(allTypes.filter(t => names.has(t.name!)));
      this.tags = [];
      for(let t of this.item.attributes['tags']) {
        this.tags.push({name: t});
      }
    };
    console.log(this.tags);
    this.formControl.setValue(this.tags.map(t => t.name));
    console.log(this.formControl);

    this.sessionService.itemActivated$.subscribe(item => {
      console.log('tags-ctrl item Activated', this.item);
      console.log(this);
      
      if (item && item.attributes && 'tags' in item.attributes) {
        //const names = new Set(this.getItemTypes(this.item).map(t => t.name!));
        //const allTypes = this.itemService.getTypes();
        //this.formControl.setValue(allTypes.filter(t => names.has(t.name!)));
        this.tags = [];
        for(let t of item.attributes['tags']) {
          this.tags.push({name: t});
        }

        item.attributes['tags'] = this.tags.map(t => t.name);
      };
      
      this.formControl.setValue(this.tags.map(t => t.name));
      console.log(this.formControl);
    });
    
    //console.log(this.formControl);
  }

}
