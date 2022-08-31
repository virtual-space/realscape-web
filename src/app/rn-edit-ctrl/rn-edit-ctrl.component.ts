import { P } from '@angular/cdk/keycodes';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RnCtrlComponent } from '../rn-ctrl/rn-ctrl.component';
import { Item, ItemEvent } from '../services/item.service';

@Component({
  selector: 'app-rn-edit-ctrl',
  templateUrl: './rn-edit-ctrl.component.html',
  styleUrls: ['./rn-edit-ctrl.component.sass']
})
export class RnEditCtrlComponent extends RnCtrlComponent implements OnInit {
    
    override ngOnInit(): void {
      this.rebuildFormControl();
    }

    override itemChanged(item?: Item): void {
      this.rebuildFormControl();
    }

    rebuildFormControl() {
      ////console.log(this.formControl);
      this.formControl.setValue(this.getValue());
      if(this.formGroup) {
          if(this.control) {
            const field_name = this.getControlAttribute('field_name', this.control.name? this.control.name : 'value');
            //console.log('edit_ctrl', field_name);
            this.formGroup.removeControl(field_name);
            this.formGroup.addControl(field_name, this.formControl);
            ////console.log('*** rebuild form control ***', this.formGroup);
          }
      }
      ////console.log(this.formGroup);
    }
}
