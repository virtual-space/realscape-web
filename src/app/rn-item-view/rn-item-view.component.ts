import { Component, Input, OnChanges, OnDestroy, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { Subject } from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import { Item, itemIsInstanceOf, ItemEvent, Query } from '../services/item.service';

import {FormControl, FormGroup} from "@angular/forms";
import { RnViewComponent } from '../rn-view/rn-view.component';

@Component({
  selector: 'app-rn-item-view',
  templateUrl: './rn-item-view.component.html',
  styleUrls: ['./rn-item-view.component.sass']
})
export class RnItemViewComponent extends RnViewComponent implements OnInit, OnChanges {

  @Input() id?: string;
  @Input() children: Item[] = [];
  @Input() views: Item[] = [];
  @Input() query?: Query;
  @Input() apps: Item[] = [];
  @Input() activeViewIndex: number = 0;

  @Input() allowAddingItems = true;
  @Input() allowAddingViews = true;
  @Input() allowEditingViews = true;

  public hierarchy = false;

  eventsSubject: Subject<ItemEvent> = new Subject<ItemEvent>();

  selectedView = new FormControl(0);
  @Input() editable = false;

  resource = 'items';

  override ngOnInit(): void {
    this.formGroup = new FormGroup({});
    //////////console.log'item-view init ', this.item);
    this.sessionService.itemActivated$.subscribe(item => {
        this.itemChanged(item);
    });
    this.sessionService.itemsActivated$.subscribe(items => {
      
      if (items) {
        this.refreshItems(items);
      }
      
      this.itemsChanged(items);
    });
    this.sessionService.refreshed$.subscribe(() => {
      this.refreshView();
    });
    this.onRefresh.subscribe(e => {
      this.refreshView();
    });
    this.apps = this.itemService.getApps();
    if (this.item) {
      this.reloadItem(this.item);
    } else {
        this.route.paramMap.subscribe(params => {
          //////////console.logparams);
          const id = params.get('id');
          const res = params.get('resource');
          if (res) {
            this.resource = res;
          }
          if(id && (!this.item || id != this.id)) {
            this.retrieve(id, this.hierarchy, this.resource);
          }
        });
    }
    
  }

  retrieve(id: string, edit:boolean=false, resource:string='items'): void {
    console.log('*** retrieve ', id, resource);
    this.itemService.getItem(id, edit, resource).subscribe(item => {
      if (item) {
        this.item = item;
        this.reloadItem(item);
      }
    });
  }

  refreshView(): void {
    console.log('*** refreshView ***');
    if (this.id) {
      this.retrieve(this.id, this.hierarchy, this.resource);
    } else if(this.item) {
      this.reloadItem(this.item);
    }
  }

  refreshItems(items: Item[]) {
    //console.log'*** refresh_items ***', items);
    this.items = [...items];
    if (this.item) {
      this.item.items = [...items];
      this.reloadItem(this.item);
    }
  }

  onRefreshClick(): void {
    this.refreshView();
  }

  reloadItem(item: Item): void {
    console.log('*** reloading ',item);
    this.views = this.getItemViews(item);
    //////console.log'*** controls before reload item:', this.controls);
    this.controls = this.getItemControls(item);
    //////console.log'*** controls after reload item:', this.controls);
    //////////console.logthis.views);
    this.query = this.getItemQuery(item);
    this.id = item.id;
    const active_view = this.views[this.activeViewIndex];
    const view_query = this.getItemQuery(active_view);
    console.log('*** query ', this.query);
    console.log('*** view_query ', view_query);
    if (item.items && item.items.length > 0) {
      //////////console.log'children = items', item.items);
      this.children = [...item.items];
      //this.sessionService.activateItems(this.children);
    } else if (view_query) {
      //view_query.parent_id = this.id; 
      if (view_query.children)
      {
          view_query.parent_id = this.id;
      }
      this.itemService.items(view_query).subscribe(items => {
        this.children = items;
        //this.sessionService.activateItems(this.children);
      });
    }  else if (this.query) {
      ////////console.logthis.query.my_items);
      ////////console.logthis.item);
      if (this.query) {
        if (this.query.children)
        {
          this.query.parent_id = this.id;
        }
      }
      //if (q.my_)
      this.itemService.items(this.query).subscribe(items => {
        this.children = items;
        //this.sessionService.activateItems(this.children);
      });
    } else {
      console.log('*** 4 ***', this);
      //////////console.log'children = chidlren')
      if (this.hierarchy) {
        this.itemService.children(this.id!).subscribe(children => {
          //////console.log'set children ', children);
          this.children = children;
          //this.sessionService.activateItems(this.children);
        });
      } else {
        this.children = [];
      }
    }
    //this.sessionService.activateItem(item);
  }

  shouldShowChildren(item: Item): boolean {
    const attrs = this.itemService.collectItemAttributes(item, {});
    if ('show_children' in attrs) {
      return attrs['show_children'] === 'true';
    }
    return false;
  }

  shouldShowViewsAsItems(item: Item): boolean {
    const attrs = this.itemService.collectItemAttributes(item, {});
    if ('show_views_as_items' in attrs) {
      return attrs['show_views_as_items'] === 'true';
    }
    return false;
  }

  override ngOnChanges(changes: SimpleChanges): void {
    if(changes['item']) {
      if (this.item) {
        ////////console.log'********************* item view reloading item', this.item);
        this.reloadItem(this.item);
      }
      
    }
  }

  onItemEvent(event: ItemEvent) {
    ////////console.logevent);
  }

  onChangeTab(event: any) {
    ////console.log(event);
    this.eventsSubject.next({event: 'tab', data: {index: event.index}, item: this.item});
    this.activeViewIndex = event.index;
    const active_view = this.views[this.activeViewIndex];
    const view_query = this.getItemQuery(active_view);
    //console.log('view_query ', view_query, active_view);
    if (view_query) {
      if (view_query.children)
      {
          view_query.parent_id = this.id;
      }
      this.itemService.items(view_query).subscribe(items => {
        this.children = items;
      });
    }
  }

  getItemDefaultView(item?: Item) {
    //////////console.logitem);
    if (item && item.items) {
      const views = item.items.filter(i => itemIsInstanceOf(i, 'View'));
      //////////console.logviews);
      if (views.length > 0) {
        if (views.length < this.activeViewIndex) {
          return views[this.activeViewIndex];
        }

        if (views.length > 0) {
          return views[0];
        }
      }
    }
    return undefined
  }

  getActiveView(): Item {
    return this.views[this.activeViewIndex];
  }



  addItem() {
    if (this.item) {
      this.onAdd(this.item);
    }
  }

  addLink() {
    if (this.item) {
      this.onAddLink(this.item);
    }
  }

  addView() {
    if (this.item) {
      const view = new Item();
      view.id = this.item.id;
      view.attributes = {creatable_types: ["View"]};
      view.name = this.item.name! + " View"
      this.onAddView(view);
    }
  }

  editItem() {
    if (this.item) {
      this.onEdit(this.item);
    }
  }

  editView() {
    if (this.item) {
      this.onEditView(this.views[this.activeViewIndex]);
    }
  }

  editQuery() {
    if (this.item) {
      this.onEditQuery(this.item);
    }
  }

  editViewQuery() {
    if (this.item) {
      this.onEditViewQuery(this.views[this.activeViewIndex]);
    }
  }

  deleteItem() {
    if (this.item) {
      this.onDelete(this.item);
    }
  }

  deleteView() {
    if (this.item) {
      this.onDeleteView(this.views[this.activeViewIndex]);
    }
  }

  override itemChanged(item?: Item): void {
    ////////console.log"*** item_view item_changed ***");
    if (item) {
      //this.item = item;
      this.refreshView();
    }
    
  }

  override itemsChanged(items?: Item[]): void {
    ////console.log"*** item_view items_changed ***");
    //this.sessionService.activateItems(items);
  }

  hierarchyToggleChanged(event: any): void {
    //////console.log"*** hierarchy toggle changed ***", event, this.hierarchy);
    if (this.id) {
      this.retrieve(this.id,this.hierarchy);
    }
    
    //this.sessionService.activateItems(items);
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  doLogout() {
    this.authService.logout();
    this.router.navigate(['']);
  }

  override queryChangedHandler(event: any) {
    /*
    //console.log('*** item view query change handler ***', event);
    //console.log(this);
    const active_view = this.views[this.activeViewIndex];
    const view_query = this.getItemQuery(active_view);
    //console.log(view_query);
    //console.log(this.query);
    if (view_query) {
      if (view_query.my_items)
      {
          view_query.parent_id = this.id;
      }
      this.itemService.items(view_query).subscribe(items => {
        const location_query = new Query();
        location_query.location = event.location;
        this.itemService.items(location_query).subscribe(location_items => {
          this.children = items.concat(location_items);
        });
      });
    } else if (this.query) {
      this.itemService.items(this.query).subscribe(items => {
        const location_query = new Query();
        location_query.location = event.location;
        this.itemService.items(location_query).subscribe(location_items => {
          this.children = items.concat(location_items);
        });
        
      });
    } else if (this.item && this.item!.items && this.item!.items!.length > 0) {
      const location_query = new Query();
      location_query.location = event.location;
      this.itemService.items(location_query).subscribe(location_items => {
        this.children = this.item!.items!.concat(location_items);
      });
    } else {
      const location_query = new Query();
      location_query.location = event.location;
      this.itemService.items(location_query).subscribe(location_items => {
        this.children = location_items;
      });
    }*/
  }
}
