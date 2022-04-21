import { Component, OnInit } from '@angular/core';
import { RnCtrlComponent } from '../rn-ctrl/rn-ctrl.component';
import { itemIsInstanceOf } from '../services/item.service';

@Component({
  selector: 'app-rn-button-ctrl',
  templateUrl: './rn-button-ctrl.component.html',
  styleUrls: ['./rn-button-ctrl.component.sass']
})
export class RnButtonCtrlComponent extends RnCtrlComponent implements OnInit {

  public onClick(event: Event) {
    if (this.control && this.control.items) {
        for(var i of this.control.items) {
          if (itemIsInstanceOf(i, "SaveItem")) {
              console.log("*** save_item ***");
          }
        }
    }
  }

}
