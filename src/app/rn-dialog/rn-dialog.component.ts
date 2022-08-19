import {  Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item, ItemEvent, ItemService } from '../services/item.service';

export interface RnDialogData {
  view: Item;
  item: Item;
  form: Item;
}

@Component({
  selector: 'app-rn-dialog',
  templateUrl: './rn-dialog.component.html',
  styleUrls: ['./rn-dialog.component.sass']
})
export class RnDialogComponent implements OnInit {
  item?: Item;
  formItem?: Item;
  public formGroup = new FormGroup({});
  constructor(
    public dialogRef: MatDialogRef<RnDialogComponent>,
    protected itemService: ItemService,
    @Inject(MAT_DIALOG_DATA) public data: RnDialogData,
  ) {}

  ngOnInit(): void {
    this.item = this.data.item;
    this.formItem = this.data.form;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onOkClick(): void {
    this.dialogRef.close();
  }

  onEvent(event: ItemEvent) {
    console.log(event);
    if (event.item) {
      if (event.event === 'click') {
        if(event.control && event.control.attributes && event.control.attributes['close'] === 'true') {
          this.dialogRef.close();
        } else {
          this.dialogRef.close(event);
        }
      } else if (event.event === 'item') {
        console.log(this.item);
        let location = this.item?.location;
        this.item = event.item;
        this.item.location = location;
        console.log(this.item);
      }
      
    }
  }

  linkCheck(item?: Item) : boolean {
    return item? this.itemService.isLink(item) : false;
  }

  extractLinkedItemId(item?: Item): string {
    return item? this.itemService.getLinkedItemId(item) : '';
  }

  itemLinkCheck(item?: Item) : boolean {
    return item? this.itemService.isInternalLink(item) : false;
  }

  extractParentRelativeLink(item?: Item): string {
    if (item && item.id) {
      return '/items/' + item.id;
    }
    return '';
  }

}
