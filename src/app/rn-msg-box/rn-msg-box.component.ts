import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface MsgboxData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-rn-msg-box',
  templateUrl: './rn-msg-box.component.html',
  styleUrls: ['./rn-msg-box.component.sass']
})
export class RnMsgBoxComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RnMsgBoxComponent>,
              @Inject(MAT_DIALOG_DATA) public data: MsgboxData) { }

  ngOnInit(): void {
  }

}
