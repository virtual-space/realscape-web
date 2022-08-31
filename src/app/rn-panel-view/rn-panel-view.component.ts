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
    //console.log(this);
    let form_name = 'view';
    let handled = false;
    if (this.formGroup) {
      this.localFormGroup = this.formGroup;
    }
    if (this.view) {
      const attrs = this.collectItemAttributes(this.view, {});
      if(attrs && 'form' in attrs) {
          const forms = this.itemService.getForms();
            //////console.log(dialogs);
            if (forms) {
              const form = forms.find(d => d.name === attrs['form']);
              if (form) {
                this.panelForm = form;
                //console.log('panel_form:', this.panelForm);
              }
            }
          handled = true;
      }
    }
    if (this.item && !handled) {
      //console.log(this.item);
      if(this.item.attributes && 'forms' in this.item.attributes ) {
        const item_forms = this.item.attributes['forms'];
        if (item_forms && item_forms.length > 0) {
          const item_form = item_forms.find((i:any) => i['name'].toLowerCase() === 'view');
          if (item_form) {
            const item_form_type = item_form['form'];
            const forms = this.itemService.getForms();
            //////console.log(dialogs);
            if (forms) {
              const form = forms.find(d => d.name === item_form_type);
              if (form) {
                this.panelForm = form;
                //console.log('panel_form:', this.panelForm);
              }
            }
          }
        }
        
      }
    }
  }

}
