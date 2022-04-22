import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RnCtrlComponent } from '../rn-ctrl/rn-ctrl.component';
import { Item } from '../services/item.service';

@Component({
  selector: 'app-rn-attrs-ctrl',
  templateUrl: './rn-attrs-ctrl.component.html',
  styleUrls: ['./rn-attrs-ctrl.component.sass']
})
export class RnAttrsCtrlComponent extends RnCtrlComponent implements OnInit, OnChanges {

  @Input() attributes: Array<[string, string]> = [];

  childFormGroup = new FormGroup({})

  override ngOnInit(): void {
    this.rebuildFormGroup();
  }

  rebuildFormGroup() {
    this.childFormGroup = new FormGroup({});
    if (this.item) {
      if (this.item.attributes) {
        this.attributes = Object.entries(this.item.attributes).map(([k, v]) => [k, v]);
        this.attributes.forEach(a => this.childFormGroup.addControl(a[0], new FormControl(a[1])));
        //console.log(this.attributes);
      }
    }

    if(this.formGroup) {
      if(this.control && this.control.name) {
        this.formGroup.removeControl('attributes');
        this.formGroup.addControl('attributes', this.childFormGroup);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['item']) {
      this.rebuildFormGroup();
    }
  }

}
