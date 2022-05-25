import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RnCtrlComponent } from '../rn-ctrl/rn-ctrl.component';

@Component({
  selector: 'app-rn-edit-ctrl',
  templateUrl: './rn-edit-ctrl.component.html',
  styleUrls: ['./rn-edit-ctrl.component.sass']
})
export class RnEditCtrlComponent extends RnCtrlComponent implements OnInit {
    
    override initialize(): void {
      this.formControl.setValue(this.getValue());

      this.formControl.valueChanges.subscribe(value => {
        console.log(value);
        this.setValue(value);
        console.log(this.item);
      });

      this.sessionService.itemActivated$.subscribe(item => {
        if (item) {
          this.formControl.setValue(this.getValue());
        };
      });
    }



}
