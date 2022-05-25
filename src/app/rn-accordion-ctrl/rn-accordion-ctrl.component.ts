import { Component, OnInit } from '@angular/core';
import { RnCtrlComponent } from '../rn-ctrl/rn-ctrl.component';

@Component({
  selector: 'app-rn-accordion-ctrl',
  templateUrl: './rn-accordion-ctrl.component.html',
  styleUrls: ['./rn-accordion-ctrl.component.sass']
})
export class RnAccordionCtrlComponent extends RnCtrlComponent implements OnInit {
  panelOpenState = false;
}
