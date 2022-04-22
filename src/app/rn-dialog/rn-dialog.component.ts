import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from '../services/item.service';

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

}
