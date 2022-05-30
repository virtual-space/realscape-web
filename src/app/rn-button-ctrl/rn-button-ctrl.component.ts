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
    console.log(this.formGroup!.value)
    if (this.item) {
      if (this.control) {
        const attrs = this.collectItemAttributes(this.control, {});
        if ('command' in attrs) {
          const command = attrs['command'];
          if (command === "Save") {
            console.log("*** save_item ***", this.item);
            this.itemService.update(this.item!.id!, this.getUpdateParams2(this.formGroup!.value)).subscribe(item => {
              this.sessionService.activateItem(item);
            });
        } else if (command === "Create") {
          console.log("*** create_item ***", this.formGroup!.value);
          this.itemService.create(this.getUpdateParams2(this.formGroup!.value, true)).subscribe(item => {
            this.sessionService.activateItem(item);
          });
        } else if (command === "Find") {
          console.log("*** find_item ***", this.formGroup!.value);
          this.itemService.items(this.queryFromItem(this.getUpdateParams2(this.formGroup!.value))).subscribe(items => {
            this.sessionService.activateItems(items);
          });
        } else if (command === "Reset") {
          /*
          if (this.onRefresh) {
            this.onRefresh.emit();
          }*/
          console.log("*** reset_item ***");
          if (this.item) {
            this.sessionService.activateItem(this.item);
          } else {
            this.sessionService.activateItem(new Item());
          }
        } else if (command === "Delete") {
          console.log("*** delete_item ***");
        } else {
          console.log("*** unknown ***");
        }
        }
      }
    }
  }
}
