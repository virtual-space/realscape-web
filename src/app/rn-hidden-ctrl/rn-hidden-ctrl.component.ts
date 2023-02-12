import { Component, OnInit } from '@angular/core';
import { RnCtrlComponent } from '../rn-ctrl/rn-ctrl.component';
import { Item } from '../services/item.service';

@Component({
  selector: 'app-rn-hidden-ctrl',
  templateUrl: './rn-hidden-ctrl.component.html',
  styleUrls: ['./rn-hidden-ctrl.component.sass']
})
export class RnHiddenCtrlComponent extends RnCtrlComponent implements OnInit {

  override ngOnInit(): void {
    this.rebuildFormControl();
  }

  override itemChanged(item?: Item): void {
    this.rebuildFormControl();
  }

  rebuildFormControl() {
    ////////console.logthis.formControl);
    this.formControl.setValue(this.getValue());
    if(this.formGroup) {
        if(this.control) {
          let fieldName = this.getControlAttribute('field_name', '', this.control);
          if (!fieldName) {
            fieldName = this.getControlAttribute('target', '', this.control);
          }
          //////console.log'edit_ctrl', field_name);
          this.formGroup.removeControl(fieldName);
          this.formGroup.addControl(fieldName, this.formControl);
          ////////console.log'*** rebuild form control ***', this.formGroup);
        }
    }
    //console.log(this.formControl.value);
  }

}
