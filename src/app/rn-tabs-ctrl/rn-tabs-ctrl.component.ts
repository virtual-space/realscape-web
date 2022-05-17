import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { RnCtrlComponent } from '../rn-ctrl/rn-ctrl.component';
import { Item, itemIsInstanceOf } from '../services/item.service';

@Component({
  selector: 'app-rn-tabs-ctrl',
  templateUrl: './rn-tabs-ctrl.component.html',
  styleUrls: ['./rn-tabs-ctrl.component.sass']
})
export class RnTabsCtrlComponent extends RnCtrlComponent implements OnInit {
  @Input() tabs: Item[] = [];

  eventsSubject: Subject<number> = new Subject<number>();

  override ngOnInit(): void {
    if (this.control && this.control.items) {
      this.tabs = this.control.items?.filter(i => itemIsInstanceOf(i, 'TabCtrl'));
    }
    //console.log('tabsctrl item', this.item);
    //console.log('tabsctrl formgroup ', this.formGroup);
    
  }

  onChangeTab(event: any) {
    //console.log(event);
    this.eventsSubject.next(event.index);
    //this.selectedTab = event.index;
  }
}
