import { Component, OnInit, SimpleChanges } from '@angular/core';
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

  rebuildSelect() {
    this.selectItems = [];
    if (this.item) {
      const attrs = this.collectItemAttributes(this.item, {});
      if ('values' in attrs) {
        for(let v of attrs['values']) {
          this.selectItems.push({value: v, viewValue: v});
        }
      } else if (this.control) {
        const ctrlAttrs = this.collectItemAttributes(this.control, {});
        if ('values' in ctrlAttrs) {
          for(let v of ctrlAttrs['values']) {
            this.selectItems.push({value: v, viewValue: v});
          }
        } 
      }
      this.selectedValue = this.formControl.value;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['item']) {
      console.log('item changed', changes);
      this.rebuildSelect();
    }
  }

}
