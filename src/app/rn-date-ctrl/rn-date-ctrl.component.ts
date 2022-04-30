import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RnCtrlComponent } from '../rn-ctrl/rn-ctrl.component';

@Component({
  selector: 'app-rn-date-ctrl',
  templateUrl: './rn-date-ctrl.component.html',
  styleUrls: ['./rn-date-ctrl.component.sass']
})
export class RnDateCtrlComponent extends RnCtrlComponent implements OnInit {

  private date_value?: Date;
  public get date() { return this.date_value; }
  public set date(newValue) {
    this.date_value = newValue;
    this.formControl.setValue(this.datetime);
  }

  private time_value?: string;
  public get time() { return this.time_value; }
  public set time(newValue) {
    this.time_value = newValue;
    this.formControl.setValue(this.datetime);
  }


  public get datetime() { 
    if (this.date_value) {
      if (this.time_value) {
        const result = new Date(this.date_value);
        const time = this.time_value.split(":");
        if (time.length === 2) {
          const hours = parseInt(time[0]);
          const time_minutes = time[1].split(" ");
          if (time_minutes.length === 2) {
            const minutes = parseInt(time_minutes[0]);
            result.setHours(hours);
            result.setMinutes(minutes);
          }
        }
        return result;
      } else {
        return this.date_value;
      }
    }
    return undefined;
  }


}
