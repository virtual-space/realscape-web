import { Component, Input, OnInit } from '@angular/core';
import { RnCtrlComponent } from '../rn-ctrl/rn-ctrl.component';

@Component({
  selector: 'app-rn-date-ctrl',
  templateUrl: './rn-date-ctrl.component.html',
  styleUrls: ['./rn-date-ctrl.component.sass']
})
export class RnDateCtrlComponent extends RnCtrlComponent implements OnInit {

  @Input() date?: string

}
