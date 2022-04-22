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

  constructor(
    public dialogRef: MatDialogRef<RnDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RnDialogData,
  ) {}

  ngOnInit(): void {
    console.log(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onOkClick(): void {
    this.dialogRef.close();
  }

  onEvent(event: ItemEvent) {
    if (event.item) {
      if(event.item.attributes && event.item.attributes['close'] === 'true') {
        this.dialogRef.close();
      } else {
        this.dialogRef.close(event);
      }
    }
  }

}
