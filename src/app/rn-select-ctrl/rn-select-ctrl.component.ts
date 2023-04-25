import { Component, OnInit, SimpleChanges } from '@angular/core';
import { RnCtrlComponent } from '../rn-ctrl/rn-ctrl.component';
import { Item } from '../services/item.service';

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

  override ngOnInit(): void {
    this.rebuildSelect();
  }

  override itemChanged(item?: Item): void {
    this.rebuildSelect();
  }

  rebuildSelect() {
    console.log('REBUILD_SELECT');
    this.formControl.setValue(this.getValue());
    this.selectItems = [];
    if (this.item) {
      const attrs = this.collectItemAttributes(this.item, {});
      if ('values' in attrs) {
        for(let v of attrs['values']) {
          this.selectItems.push({value: v, viewValue: v});
        }
      } else if ('options' in attrs) {
        for(let v of attrs['options']) {
          this.selectItems.push({value: v, viewValue: v});
        }
      } else if (this.control) {
        const ctrlAttrs = this.collectItemAttributes(this.control, {});
        if ('values' in ctrlAttrs) {
          for(let v of ctrlAttrs['values']) {
            this.selectItems.push({value: v, viewValue: v});
          }
        } 
        else if ('options' in ctrlAttrs) {
          for(let v of ctrlAttrs['options']) {
            this.selectItems.push({value: v, viewValue: v});
          }
        } 
      }
      this.selectedValue = this.formControl.value;
    }
    if(this.formGroup) {
      if(this.control) {
        const field_name = this.getControlAttribute('field_name', this.control.name? this.control.name : 'value');
        ////////console.log'edit_ctrl', field_name);
        this.formGroup.removeControl(field_name);
        this.formGroup.addControl(field_name, this.formControl);
        ////////console.log'*** rebuild form control ***', this.formGroup);
      }
    }
  }

}
