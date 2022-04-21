import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { RnCtrlComponent } from '../rn-ctrl/rn-ctrl.component';
import { Item } from '../services/item.service';

@Component({
  selector: 'app-rn-item-select-ctrl',
  templateUrl: './rn-item-select-ctrl.component.html',
  styleUrls: ['./rn-item-select-ctrl.component.sass']
})
export class RnItemSelectCtrlComponent extends RnCtrlComponent implements OnInit {
    items: Item[] = [];
    selectedName = "";
    selectedId = "";

    
    onSelectChange(event: MatSelectChange) {
      /*
      const e = this.items.filter(t => t.name === event.value)[0];
      if (e && e.icon) {
        this.selectedIcon = e.icon;
      }*/
    }

    getItemIcon(item: Item) {
      return '';
    }
}
