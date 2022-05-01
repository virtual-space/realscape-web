import { Component, OnInit } from '@angular/core';
import { RnCtrlComponent } from '../rn-ctrl/rn-ctrl.component';

interface SelectItem {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-rn-select-ctrl',
  templateUrl: './rn-select-ctrl.component.html',
  styleUrls: ['./rn-select-ctrl.component.sass']
})
export class RnSelectCtrlComponent  extends RnCtrlComponent implements OnInit {
  selectedValue?: string;

  selectItems: SelectItem[] = [];

  protected  override initialize(): void {
    if (this.item && this.item.attributes && 'values' in this.item.attributes) {
      for(let v of this.item.attributes['values']) {
        this.selectItems.push({value: v, viewValue: v});
      }
    } else if (this.control && this.control.attributes && 'values' in this.control.attributes) {
      for(let v of this.control.attributes['values']) {
        this.selectItems.push({value: v, viewValue: v});
      }
    }
    this.selectedValue = this.formControl.value;
  }

}
