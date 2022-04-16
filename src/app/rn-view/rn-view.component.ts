import { L } from '@angular/cdk/keycodes';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { stringify } from 'querystring';
import { Item } from '../services/item.service';

@Component({
  selector: 'app-rn-view',
  templateUrl: './rn-view.component.html',
  styleUrls: ['./rn-view.component.sass']
})
export class RnViewComponent implements OnInit, OnChanges {

  @Input() view?: Item;
  @Input() items: Item[] = [];
  @Input() item?: Item;

  public isControl: boolean = false;

  constructor() { }

  ngOnInit(): void {
    //console.log('*************************************** hello from view');
    //console.log(this.item);
    if (this.view) {
      if (this.view.type) {
        if (this.view.type.base) {
          if (this.view.type.base.name) {
            if (this.view.type.base.name === "CtrlView") {
              this.isControl = true;
            }
          }
        }
      }
    }
  }

  getItemViewTarget(items: Item[]): Item | undefined {
    console.log(this);
    if (this.view && this.view.attributes) {
      //console.log(this.view.attributes);
      //console.log('select_name' in this.view.attributes);
      //console.log(this.view.attributes['select_name']);
      let select_name: string | undefined;
      let select_type: string | undefined;
      if('select_name' in this.view.attributes) {
        select_name = this.view.attributes['select_name'];
      }
      if('select_type' in this.view.attributes) {
        select_type = this.view.attributes['select_type'];
      }
        //let select_name = this.view.attributes['select_name'] ? ('select_name' in this.view.attributes) : undefined
        //let select_type = this.view.attributes['select_type'] ? ('select_type' in this.view.attributes) : undefined
        let result =  items.filter(i => i.name === select_name && i.type!.name === select_type).find(e => true);
        //console.log('select ', select_name, select_type, result);
        return result;
    }
    return undefined;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['item']) {
      //console.log('*************************************** hello from view changed!!!');
      //console.log(this.item);
    }
  }

}
