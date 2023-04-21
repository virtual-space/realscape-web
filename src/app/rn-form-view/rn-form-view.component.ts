import { Component, OnInit } from '@angular/core';
import { RnViewComponent } from '../rn-view/rn-view.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-rn-form-view',
  templateUrl: './rn-form-view.component.html',
  styleUrls: ['./rn-form-view.component.sass']
})
export class RnFormViewComponent extends RnViewComponent implements OnInit {


  override ngOnInit(): void {
    this.formGroup = new FormGroup({});
    const attrs = this.view?.attributes;
    if(attrs && attrs['form']) {
      const formName = attrs['form'];
      const form = this.itemService.getForms().find(f => f.name === formName);
      if (form) {
        this.formItem = form;
      }
      //console.log('*** form ***', attrs['form']);
    }
    
    //const forms = this.itemService.getForms();

  }

}
