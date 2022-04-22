import { L } from '@angular/cdk/keycodes';
import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { stringify } from 'querystring';
import { Item, ItemEvent, itemIsInstanceOf, ItemService } from '../services/item.service';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-rn-view',
  templateUrl: './rn-view.component.html',
  styleUrls: ['./rn-view.component.sass']
})
export class RnViewComponent implements OnInit, OnChanges {

  @Input() view?: Item;
  @Input() items: Item[] = [];
  @Input() item?: Item;
  @Output() onEvent = new EventEmitter<ItemEvent>();

  public isControl: boolean = false;

  @ViewChildren(RnViewComponent) itemViews!: QueryList<RnViewComponent>;

  constructor(protected itemService: ItemService, 
              protected sessionService: SessionService, 
              protected route: ActivatedRoute) { }

  ngOnInit(): void {
    //console.log('*************************************** hello from view');
    //console.log(this.item);
    
    if (this.view) {
      this.isControl = itemIsInstanceOf(this.view, "CtrlView");
    }
  }

  getItemViewTarget(items: Item[]): Item | undefined {
    //console.log(this);
    if (this.view && this.view.attributes) {
      //console.log(this.view.attributes);
      //console.log('select_name' in this.view.attributes);
      //console.log(this.view.attributes['select_name']);
      let select_name: string | undefined;
      let select_type: string | undefined;
      if('select_name' in this.view.attributes) {
        select_name = this.view.attributes['select_name'];
      }
      if('select_type' in this.view.attributes) {
        select_type = this.view.attributes['select_type'];
      }
        //let select_name = this.view.attributes['select_name'] ? ('select_name' in this.view.attributes) : undefined
        //let select_type = this.view.attributes['select_type'] ? ('select_type' in this.view.attributes) : undefined
        let result =  items.filter(i => i.name === select_name && i.type!.name === select_type).find(e => true);
        //console.log('select ', select_name, select_type, result);
        return result;
    }
    return undefined;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['item']) {
      //console.log('*************************************** hello from view changed!!!');
      //console.log(this.item);
    }
  }

  onEventHandler(event: ItemEvent) {
    console.log(event);
    if(this.onEvent) {
      this.onEvent.emit(event);
    }
  }

  public onActivateHandler(index: number) {
    //console.log('activating view ', this);
    this.onActivate(index);

    if (this.itemViews) {
      //console.log('child views ', this.itemViews.toArray());
      //console.log('activating view ', this.itemViews.toArray()[index]);
      const view = this.itemViews.toArray()[index];
      if (view) {
        view.onActivateHandler(index);
      }
    }
  }

  public onActivate(index: number) {
    //console.log('activating view ', this);
  }

}
