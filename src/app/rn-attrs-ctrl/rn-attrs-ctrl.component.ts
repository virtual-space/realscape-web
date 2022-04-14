import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RnCtrlComponent } from '../rn-ctrl/rn-ctrl.component';
import { Item } from '../services/item.service';

@Component({
  selector: 'app-rn-attrs-ctrl',
  templateUrl: './rn-attrs-ctrl.component.html',
  styleUrls: ['./rn-attrs-ctrl.component.sass']
})
export class RnAttrsCtrlComponent extends RnCtrlComponent implements OnInit {

  @Input() attributes: Array<[string, string]> = [];

  override ngOnInit(): void {
    if (this.item) {
      if (this.item.attributes) {
        this.attributes = Object.entries(this.item.attributes).map(([k, v]) => [k, v])
      }
    }
  }

}
