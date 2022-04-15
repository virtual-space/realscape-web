import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RnCtrlComponent } from '../rn-ctrl/rn-ctrl.component';

@Component({
  selector: 'app-rn-edit-ctrl',
  templateUrl: './rn-edit-ctrl.component.html',
  styleUrls: ['./rn-edit-ctrl.component.sass']
})
export class RnEditCtrlComponent extends RnCtrlComponent implements OnInit {

  text = new FormControl('');
  

}
