import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import { Item, ItemService, itemIsInstanceOf } from '../services/item.service';
import { SessionService } from '../services/session.service';

import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-rn-item-view',
  templateUrl: './rn-item-view.component.html',
  styleUrls: ['./rn-item-view.component.sass']
})
export class RnItemViewComponent implements OnInit, OnDestroy, OnChanges {

  @Input() id?: string;
  @Input() item?: Item;
  @Input() items: Item[] = [];
  @Input() children: Item[] = [];
  @Input() views: Item[] = [];
  @Input() query?: Item;

  @Input() allowAddingItems = true;
  @Input() allowAddingViews = true;
  @Input() allowEditingViews = true;

  subscription?: Subscription;

  selectedView = new FormControl(0);

  constructor(private itemService: ItemService, 
              private sessionService: SessionService, 
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    if (this.item) {
        this.reloadItem(this.item, false);
    } else {
        this.route.paramMap.subscribe(params => {
          const id = params.get('id');
          if(id && (!this.item || id != this.id)) {
            this.subscription = this.sessionService.refreshed$.subscribe(
              () => {
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
    this.itemService.getItem(id).subscribe(item => {
      if (item) {
        this.reloadItem(item, true);
      }
    });
  }

  reloadItem(item: Item, activate: boolean): void {
    this.id = item.id;  
    this.item = item;

    if (this.id) {
      this.itemService.children(this.id).subscribe(children => {
        this.children = children.filter(child => !itemIsInstanceOf(child, "View"));
        this.views = children.filter(child => itemIsInstanceOf(child, "View"));
        this.query = this.children.find(child => {
          if (child) {
            return itemIsInstanceOf(child, "Query");
          } else {
            return false;
          }
        });
        if(this.query) {
            this.itemService.items(this.query.attributes!).subscribe(items => {
              this.items = items;
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
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['item']) {
      if (this.item) {
        this.reloadItem(this.item, false);
      }
      
    }
  }

  onChangeTab(event: any) {
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

  onAddView(event: any) {
    /*
    const dialogRef = this.dialog.open(EditViewComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.views.push(result);
        this.selectedView.setValue(this.views.length - 1);
        this.onSaveViews();
      }
    });
    */
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

  onAdd(event: any): void {
    //this.addItem({});
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
