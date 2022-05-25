import { Component, OnInit } from '@angular/core';
import { RnCtrlComponent } from '../rn-ctrl/rn-ctrl.component';
import { Item } from '../services/item.service';

@Component({
  selector: 'app-rn-code-ctrl',
  templateUrl: './rn-code-ctrl.component.html',
  styleUrls: ['./rn-code-ctrl.component.sass']
})
export class RnCodeCtrlComponent extends RnCtrlComponent  implements OnInit {

  getCodemirrorOptions(item: Item) {
    const options: {[index:string]: any} = {
      lineNumbers: true
    }

    if (item.attributes) {
      if(item.attributes['theme']) {
        options['theme'] = item.attributes['theme'];
      }
      if(item.attributes['mode']) {
        options['mode'] = item.attributes['mode'];
      }
    }
    return options;
  }
}
