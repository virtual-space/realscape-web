import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { RnCtrlComponent } from '../rn-ctrl/rn-ctrl.component';
import { Item, ItemEvent, itemIsInstanceOf } from '../services/item.service';

@Component({
  selector: 'app-rn-tabs-ctrl',
  templateUrl: './rn-tabs-ctrl.component.html',
  styleUrls: ['./rn-tabs-ctrl.component.sass']
})
export class RnTabsCtrlComponent extends RnCtrlComponent implements OnInit {
  @Input() tabs: Item[] = [];

  eventsSubject: Subject<ItemEvent> = new Subject<ItemEvent>();

  override ngOnInit(): void {
    if (this.control) {
      this.tabs = this.getItemControls(this.control).filter(i => itemIsInstanceOf(i, 'TabCtrl'));
    }
    //////console.log('tabsctrl item', this.item);
    //////console.log('tabsctrl formgroup ', this.formGroup);
    
  }

  onChangeTab(event: any) {
    ////console.log(event);
    this.eventsSubject.next({event: 'tab', data: {index: event.index}, item: this.item});
    //this.selectedTab = event.index;
  }
  
}
