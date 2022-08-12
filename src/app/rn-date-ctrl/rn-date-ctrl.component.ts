import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RnCtrlComponent } from '../rn-ctrl/rn-ctrl.component';
import { Item } from '../services/item.service';

@Component({
  selector: 'app-rn-date-ctrl',
  templateUrl: './rn-date-ctrl.component.html',
  styleUrls: ['./rn-date-ctrl.component.sass']
})
export class RnDateCtrlComponent extends RnCtrlComponent implements OnInit {

  override ngOnInit(): void {
    this.rebuildFormControl();
  }

  override itemChanged(item?: Item): void {
    this.rebuildFormControl();
  }

  rebuildFormControl() {
    //console.log(this.formControl);
    //console.log(this.getValue());
    this.formControl.setValue(this.getValue());
    if(this.formGroup) {
        if(this.control) {
          const field_name = this.getControlAttribute('field_name', this.control.name? this.control.name : 'value');
          //console.log('edit_ctrl', field_name);
          this.formGroup.removeControl(field_name);
          this.formGroup.addControl(field_name, this.formControl);
          //console.log('*** rebuild form control ***', this.formGroup);
        }
      }
      if (this.formControl.value) {
        this.date_value = new Date(this.formControl.value + 'Z');
        let ampm = 'AM';
        let hours = this.date_value.getHours();
        if (hours > 12) {
          hours = hours - 12;
          ampm = 'PM';
        }
        const minutes = this.date_value.getMinutes();
        this.time_value = (('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + ' ' + ampm);
      }
  }

  private date_value?: Date;
  public get date() {
    return this.date_value;
  }
  public set date(newValue) {
    this.date_value = newValue;
    this.formControl.setValue(this.datetime);
  }

  private time_value?: string;
  public get time() {
   return this.time_value;
  }
  public set time(newValue) {
    this.time_value = newValue;
    this.formControl.setValue(this.datetime);
  }


  public get datetime() {
    if (this.date_value) {
      if (this.time_value) {
        const result = new Date(this.date_value + 'Z');
        const time = this.time_value.split(":");
        if (time.length === 2) {
          const hours = parseInt(time[0]);
          const time_minutes = time[1].split(" ");
          if (time_minutes.length === 2) {
            const minutes = parseInt(time_minutes[0]);
            const ampm = time_minutes[1];
            if (ampm === 'PM') {
              result.setHours(hours + 12);
            } else {
              result.setHours(hours);
            }
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

  protected  override initialize(): void {

  }


}
