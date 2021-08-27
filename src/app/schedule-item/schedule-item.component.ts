import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import * as moment from 'moment';

@Component({
  selector: 'app-schedule-item',
  templateUrl: './schedule-item.component.html',
  styleUrls: ['./schedule-item.component.scss']
})
export class ScheduleItemComponent implements OnInit {

  dateFrom = moment().format();
  timeFrom = moment().format("HH:mm");
  dateTo = this.dateFrom;
  timeTo = this.timeFrom;

  constructor(public dialogRef: MatDialogRef<ScheduleItemComponent>,
              public dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    if (this.data) {
      if ('valid_from' in this.data && this.data['valid_from'] != null) {
        this.dateFrom = moment(this.data['valid_from']).local().format();
        this.timeFrom = moment(this.dateFrom).format("HH:mm");
      } else {
        this.dateFrom = null;
        this.timeFrom = null;
      }
      if ('valid_to' in this.data && this.data['valid_to'] != null) {
        this.dateTo = moment(this.data['valid_to']).local().format();
        this.timeTo = moment(this.dateTo).format("HH:mm");
      } else {
        this.dateTo = null;
        this.timeTo = null;
      }
    }
  }

  onOkClick(): void {
    const result = {valid_from: null, valid_to: null};

    if (this.dateFrom) {
      if (this.timeFrom) {
        result['valid_from'] = moment(`${moment(this.dateFrom).format('YYYY-MM-DD')} ${this.timeFrom}`).utc().format();
      } else {
        result['valid_from'] = moment(this.dateFrom).utc().format();
      }
    }

    if (this.dateTo) {
      if (this.timeTo) {
        result['valid_to'] = moment(`${moment(this.dateTo).format('YYYY-MM-DD')} ${this.timeTo}`).utc().format();
      } else {
        result['valid_to'] = moment(this.dateTo).utc().format();
      }
    }

    /*
    console.log(this.dateFrom);
    console.log(this.timeFrom);
    const a = `${moment(this.dateFrom).format('YYYY-MM-DD')} ${this.timeFrom}`;
    console.log(a);
    const b = `${moment(this.dateTo).format('YYYY-MM-DD')} ${this.timeTo}`;
    console.log(b);
    console.log(moment(a).format(), moment(b).format());
     */
    console.log(result);
    this.dialogRef.close(result);
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onClearClick(): void {
    this.dateFrom = null;
    this.timeFrom = null;
    this.dateTo = null;
    this.timeTo = null;
  }

}
