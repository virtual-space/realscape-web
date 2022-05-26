import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RnCtrlComponent } from '../rn-ctrl/rn-ctrl.component';
import { Item, ItemEvent, Type } from '../services/item.service';

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

  collectAttributes() {
    let attrs: {[index: string]:any} = {};
    if (this.item) {
      //console.log(this.item);
      if (this.item.type) {
        attrs = this.collectTypeAttributes(this.item.type, attrs);
      }
      //console.log(attrs);
      if (this.item.attributes) {
        attrs = Object.assign(attrs, this.item.attributes);
      }
      //console.log(attrs);
    }
    return attrs;
  }

  rebuildFormGroup() {
    this.childFormGroup = new FormGroup({});
    this.attributes = Object.entries(this.collectAttributes()).map(([k, v]) => [k, v]);
    this.attributes.forEach(a => this.childFormGroup.addControl(a[0], new FormControl(a[1])));
    if(this.formGroup) {
      if(this.control && this.control.name) {
        this.formGroup.removeControl('attributes');
        this.formGroup.addControl('attributes', this.childFormGroup);
      }
    }
  }

  override itemChanged(item?: Item): void {
    console.log("*** attrs item changed ***");
    this.rebuildFormGroup();
  }

}
