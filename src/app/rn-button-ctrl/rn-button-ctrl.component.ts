import { Component, OnInit } from '@angular/core';
import { RnCtrlComponent } from '../rn-ctrl/rn-ctrl.component';
import { Item, itemIsInstanceOf, Query } from '../services/item.service';

@Component({
  selector: 'app-rn-button-ctrl',
  templateUrl: './rn-button-ctrl.component.html',
  styleUrls: ['./rn-button-ctrl.component.sass']
})
export class RnButtonCtrlComponent extends RnCtrlComponent implements OnInit {

  public onClick(event: Event) {
    console.log(event);
    if (this.item) {
      if (this.control && this.control.items) {
        for(var i of this.control.items) {
          if (itemIsInstanceOf(i, "Save")) {
              console.log("*** save_item ***", this.item);
              this.itemService.update(this.item!.id!, this.item).subscribe(item => {
                if (this.onRefresh) {
                  this.onRefresh.emit();
                }
              });
          } else if (itemIsInstanceOf(i, "Find")) {
            console.log("*** find_item ***");
            this.itemService.search(this.item).subscribe(items => {
              this.sessionService.activateItems(items);
            });
          } else if (itemIsInstanceOf(i, "Reset")) {
            if (this.onRefresh) {
              this.onRefresh.emit();
            }
            console.log("*** reset_item ***");
          } else if (itemIsInstanceOf(i, "Delete")) {
            console.log("*** delete_item ***");
          } else {
            console.log("*** unknown ***");
          }
        }
    }
    }
    
  }

}
