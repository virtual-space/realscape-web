import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import { Item, ItemService, itemIsInstanceOf, ItemEvent } from '../services/item.service';
import { SessionService } from '../services/session.service';

import {FormControl} from "@angular/forms";
import { RnViewComponent } from '../rn-view/rn-view.component';

@Component({
  selector: 'app-rn-item-view',
  templateUrl: './rn-item-view.component.html',
  styleUrls: ['./rn-item-view.component.sass']
})
export class RnItemViewComponent extends RnViewComponent implements OnInit, OnDestroy, OnChanges {

  @Input() id?: string;
  @Input() children: Item[] = [];
  @Input() views: Item[] = [];
  @Input() query?: Item;

  @Input() allowAddingItems = true;
  @Input() allowAddingViews = true;
  @Input() allowEditingViews = true;

  subscription?: Subscription;

  selectedView = new FormControl(0);

  override ngOnInit(): void {
    console.log('item-view init ', this.item);
    if (this.item) {
        this.reloadItem(this.item, false);
    } else {
        this.route.paramMap.subscribe(params => {
          const id = params.get('id');
          if(id && (!this.item || id != this.id)) {
            console.log('subscribing ',id);
            this.subscription = this.sessionService.refreshed$.subscribe(
              () => {
                console.log('subscription requesting refresh for ',id);
                this.refresh(id);
            });
            this.refresh(id);
          }
        });
    }
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  refresh(id: string): void {
    console.log('refreshing ',id);
    this.itemService.getItem(id).subscribe(item => {
      if (item) {
        this.item = item;
        this.reloadItem(item, true);
      }
    });
  }

  reloadItem(item: Item, activate: boolean): void {
    console.log('reloading ',item);
    this.id = item.id;  
    if (item.items) {
      this.activateItem(item, item.items, activate);
    } else if (this.id) {
      this.itemService.children(this.id).subscribe(children => {
        this.activateItem(item, children, activate);
      });
    }
  }

  activateItem(item: Item, children: Item[], activate: boolean) {
    console.log('activating ',item);
    this.children = children.filter(child => !itemIsInstanceOf(child, "View"));
    this.views = children.filter(child => itemIsInstanceOf(child, "View"));
    if (this.views.length === 0) {
      console.log('dddddd');
    }
    this.query = this.children.find(child => {
      if (child) {
        return itemIsInstanceOf(child, "Query");
      } else {
        return false;
      }
    });
    if(this.query && this.query.attributes) {
      this.itemService.items(this.query.attributes).subscribe(items => {
        this.items = items.filter(child => !itemIsInstanceOf(child, "View"));
        if (activate) {
          this.sessionService.activateItem(item);
        }
      });
    } else {
      this.items = this.children;
      if (activate) {
        this.sessionService.activateItem(item);
      }
    }
  }

  override ngOnChanges(changes: SimpleChanges): void {
    if(changes['item']) {
      if (this.item) {
        console.log('item view reloading item', this.item);
        this.reloadItem(this.item, false);
      }
      
    }
  }

  onItemEvent(event: ItemEvent) {
    console.log(event);
  }

  onChangeTab(event: any) {
    //console.log(event);
    this.onActivateHandler(event.index);
    //this.selectedTab = event.index;
  }

  onEditView(index: number) {
    /*
    const view = this.views[index];

    const dialogRef = this.dialog.open(EditViewComponent, {
      width: '400px',
      data: view
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.views[index] = result;
        this.onSaveViews();
      }
    });
    */
  }

  onDeleteView(index: number) {
    //this.views.splice(index, 1);
    //this.onSaveViews();
  }


  onSaveViews() {
    /*
    if (this.item && (this.allowAddingViews || this.allowEditingViews)) {
      const props = Object.assign(this.item.attributes || {}, { views: this.views });
      this.itemService.update(this.item.id, {properties: props}).subscribe(res => {
        this.refresh();
      });
    } else {
      this.refresh();
    }*/
  }

  onCenterChanged(event: any) {
    //console.log('onCenterChanged', event);
    //this.center = event;
  }

  addItem(options: any) {
    //console.log(event);
    /*
    if (this.canAddItem()) {

      const createData = {};

      if (options['valid_from']) {
        createData['valid_from'] = options['valid_from'];
      }

      if (options['status']) {
        createData['status'] = options['status'];
      }

      const dialogRef = this.dialog.open(CreateItemComponent, {
        width: '400px',
        data: createData
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.uploading = true;

          if (result.file) {
            this.uploadingFile = true;
            this.uploadProgress = 0;
          }

          this.itemService.create(result, (progress) => { this.uploadProgress = progress }).subscribe(
            (res) => {
              if (res && res['id']) {
                console.log(`Success created item id: ${res['id']}`);
              }
            },
            (err) => {
              this.uploadingFile = false;
              this.uploadProgress = 0;
              this.uploading = false;
              this.snackBar.open(err['error']['Error'], 'Dismiss');
            },
            () => {
              this.uploadingFile = false;
              this.uploadProgress = 0;
              this.uploading = false;
              this.refresh();
            });
        }
      });
    }*/
  }

}
