import { Component, Input, OnChanges, OnDestroy, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { Subject } from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import { Item, itemIsInstanceOf, ItemEvent } from '../services/item.service';

import {FormControl} from "@angular/forms";
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
  @Input() query?: Item;
  @Input() apps: Item[] = [];
  @Input() activeViewIndex: number = 0;

  @Input() allowAddingItems = true;
  @Input() allowAddingViews = true;
  @Input() allowEditingViews = true;

  eventsSubject: Subject<number> = new Subject<number>();

  selectedView = new FormControl(0);

  override ngOnInit(): void {
    //console.log('item-view init ', this.item);
    this.onRefresh.subscribe(e => {
      this.refreshView();
    });
    this.apps = this.itemService.getApps();
    if (this.item) {
      this.reloadItem(this.item);
    } else {
        this.route.paramMap.subscribe(params => {
          //console.log(params);
          const id = params.get('id');
          if(id && (!this.item || id != this.id)) {
            this.retrieve(id);
          }
        });
    }
    
  }

  retrieve(id: string): void {
    //console.log('*** retrieve ', id);
    this.itemService.getItem(id).subscribe(item => {
      if (item) {
        this.item = item;
        this.reloadItem(item);
      }
    });
  }

  refreshView(): void {
    //console.log('*** refreshView ***');
    if (this.id) {
      this.retrieve(this.id);
    } else if(this.item) {
      this.reloadItem(this.item);
    }
  }

  onRefreshClick(): void {
    this.refreshView();
  }

  reloadItem(item: Item): void {
    console.log('*** reloading ',item);
    this.views = this.getItemViews(item);
    this.query = this.getItemQuery(item);
    this.id = item.id;
    const active_view = this.views[this.activeViewIndex];
    const view_query = this.getItemQuery(active_view);
    console.log('*** query ', this.query);
    console.log('*** view_query ', view_query);
    if (view_query) {
      view_query.parent_id = this.id; 
      this.itemService.items(view_query).subscribe(items => {
        this.children = items;
      });
    } else if (item.items && item.items.length > 0) {
      console.log('children = items', item.items);
      this.children = item.items;
    } else if (this.query) {
      console.log('children = query')
      this.itemService.items(this.query).subscribe(items => {
        this.children = items;
      });
    } else {
      console.log('children = chidlren')
      this.itemService.children(this.id!).subscribe(children => {
        this.children = children;
      });
    }
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
        console.log('item view reloading item', this.item);
        this.reloadItem(this.item);
      }
      
    }
  }

  onItemEvent(event: ItemEvent) {
    console.log(event);
  }

  onChangeTab(event: any) {
    console.log(event);
    this.eventsSubject.next(event.index);
    this.activeViewIndex = event.index;
    const active_view = this.views[this.activeViewIndex];
    const view_query = this.getItemQuery(active_view);
    console.log('view_query ', view_query, active_view);
    if (view_query) {
      view_query.parent_id = this.id; 
      this.itemService.items(view_query).subscribe(items => {
        this.children = items;
      });
    }
  }

  getItemDefaultView(item?: Item) {
    //console.log(item);
    if (item && item.items) {
      const views = item.items.filter(i => itemIsInstanceOf(i, 'View'));
      //console.log(views);
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
}
