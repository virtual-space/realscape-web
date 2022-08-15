import { Component, Input, OnInit } from '@angular/core';
import { RnCtrlComponent } from '../rn-ctrl/rn-ctrl.component';
import { Item, itemIsInstanceOf } from '../services/item.service';

@Component({
  selector: 'app-rn-steps-ctrl',
  templateUrl: './rn-steps-ctrl.component.html',
  styleUrls: ['./rn-steps-ctrl.component.sass']
})
export class RnStepsCtrlComponent extends RnCtrlComponent implements OnInit {
  @Input() steps: Item[] = [];
  
  override ngOnInit(): void {
    if (this.control) {
      this.steps = this.getItemControls(this.control).filter(i => itemIsInstanceOf(i, 'StepCtrl'));
    }
    //console.log('tabsctrl item', this.item);
    //console.log('tabsctrl formgroup ', this.formGroup);
    
  }

}
