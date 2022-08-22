import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RnViewComponent } from '../rn-view/rn-view.component';
import { Item } from '../services/item.service';

@Component({
  selector: 'app-rn-panel-view',
  templateUrl: './rn-panel-view.component.html',
  styleUrls: ['./rn-panel-view.component.sass']
})
export class RnPanelViewComponent extends RnViewComponent implements OnInit {

  panelForm?: Item;

  public localFormGroup: FormGroup = new FormGroup({});

  protected override initialize(): void {
    console.log(this);
    if (this.formGroup) {
      this.localFormGroup = this.formGroup;
    }
    if (this.item) {
      console.log(this.item);
      if(this.item.attributes && 'forms' in this.item.attributes ) {
        const item_forms = this.item.attributes['forms'];
        if (item_forms && item_forms.length > 0) {
          const form_name = item_forms[0]['form'];
          console.log(form_name);
          const forms = this.itemService.getForms();
          ////console.log(dialogs);
          if (forms) {
            const form = forms.find(d => d.name === form_name);
            if (form) {
              this.panelForm = form;
              console.log('panel_form:', this.panelForm);
            }
          }
        }
        
      }
    }
  }

}
