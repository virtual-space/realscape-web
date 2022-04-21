import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RnCtrlComponent } from '../rn-ctrl/rn-ctrl.component';
import { Item } from '../services/item.service';

@Component({
  selector: 'app-rn-attrs-ctrl',
  templateUrl: './rn-attrs-ctrl.component.html',
  styleUrls: ['./rn-attrs-ctrl.component.sass']
})
export class RnAttrsCtrlComponent extends RnCtrlComponent implements OnInit, OnChanges {

  @Input() attributes: Array<[string, string]> = [];

  override ngOnInit(): void {
    //console.log('*************************************** hello from attrs');
    //console.log(this.item);
    if (this.item) {
      if (this.item.attributes) {
        this.attributes = Object.entries(this.item.attributes).map(([k, v]) => [k, v]);
        //console.log(this.attributes);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['item']) {
      //console.log('*************************************** hello from attrs changed!!!');
      //console.log(this.item);
    }
  }

}
