import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-edit-query',
  templateUrl: './edit-query.component.html',
  styleUrls: ['./edit-query.component.scss']
})
export class EditQueryComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EditQueryComponent>,
              public dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  onSave(result) {
    result.save = true;
    this.dialogRef.close(result);
  }

  onClose() {
    this.dialogRef.close();
  }

  onRun(result) {
    result.run = true;
    this.dialogRef.close(result);
  }
}
