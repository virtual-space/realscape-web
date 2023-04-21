import { Component, OnInit } from '@angular/core';
import { RnViewComponent } from '../rn-view/rn-view.component';
import { Item } from '../services/item.service';

@Component({
  selector: 'app-rn-code-view',
  templateUrl: './rn-code-view.component.html',
  styleUrls: ['./rn-code-view.component.sass']
})
export class RnCodeViewComponent extends RnViewComponent implements OnInit {
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
    options['height'] = 'auto';
    return options;
  }
}
