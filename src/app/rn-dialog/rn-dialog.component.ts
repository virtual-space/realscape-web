import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item, ItemEvent } from '../services/item.service';

export interface RnDialogData {
  view: Item;
  item: Item;
}

@Component({
  selector: 'app-rn-dialog',
  templateUrl: './rn-dialog.component.html',
  styleUrls: ['./rn-dialog.component.sass']
})
export class RnDialogComponent implements OnInit {
  item?: Item;
  constructor(
    public dialogRef: MatDialogRef<RnDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RnDialogData,
  ) {}

  ngOnInit(): void {
    this.item = this.data.item;
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

}
