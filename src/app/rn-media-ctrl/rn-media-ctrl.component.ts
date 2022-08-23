import { Component, OnInit } from '@angular/core';
import { RnViewComponent } from '../rn-view/rn-view.component';
import { Item, ItemEvent } from '../services/item.service';

@Component({
  selector: 'app-rn-media-ctrl',
  templateUrl: './rn-media-ctrl.component.html',
  styleUrls: ['./rn-media-ctrl.component.sass']
})
export class RnMediaCtrlComponent extends RnViewComponent implements OnInit {

    protected override initialize(): void {
      console.log(this.item);
      console.log(this.control);
      if (this.item) {
        this.itemService.items({parent_id: this.item.id}).subscribe(items => {
          this.items = items;
          //this.sessionService.activateItems(this.children);
        });
      }
    }

    getMediaItems(item: Item): Item[] {
      return []
    }

    onItemEvent(event: ItemEvent) {
      //console.log(event);
    }

}
