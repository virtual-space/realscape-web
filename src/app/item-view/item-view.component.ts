import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Item, ItemService} from "../services/item.service";
import {Subject} from "rxjs";
import {CreateItemComponent} from "../create-item/create-item.component";
import {EditViewComponent} from "../edit-view/edit-view.component";
import {EditItemComponent} from "../edit-item/edit-item.component";
import {MatDialog} from "@angular/material/dialog";
import {FormControl} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-item-view',
  templateUrl: './item-view.component.html',
  styleUrls: ['./item-view.component.scss']
})
export class ItemViewComponent implements OnInit {
  @Input() view = null;
  @Input() item: Item = null;
  @Input() items = [];
  @Input() loading = false;

  defaultQuery = { radius: 500, around: true, myItems: true };


  selectedView = new FormControl(0);
  selectedTab = 0;
  ownItem = false;
  @Input() views = [{name: 'Items', type: 'List', icon: 'view_list'}];
  @Output() onRefresh: EventEmitter<any> = new EventEmitter();
  // @Output() onAdd: EventEmitter<any> = new EventEmitter();
  @Output() centerChanged = new EventEmitter<any>();

  @Input() allowAddingItems = true;
  @Input() allowAddingViews = true;
  @Input() allowEditingViews = true;

  paginatorSize = 20;
  numberOfProductsDisplayedInPage = 20;

  uploadProgress = 0;
  uploadingFile = false;
  uploading = false;

  @Input('activeTab')
  set activeTab(val) {
    console.log('activeTab: ' + val);
    this.eventsSubject.next();
  }

  eventsSubject: Subject<void> = new Subject<void>();
  panelOpenState = false;

  constructor(private itemService: ItemService,
              private snackBar: MatSnackBar,
              public dialog: MatDialog) { }

  ngOnInit() {
    if (this.item) {
      if (this.item.attributes && this.item.attributes['views']) {
        this.views = this.item.attributes['views'];
      }
    }
    this.getItems();
  }

  getItems() {
    this.itemService.children(this.item.id).subscribe(children => {
      this.items = children;
    });
    console.log(this.items)
  }

  refresh() {
    this.getItems();
    if (this.onRefresh) {
      this.onRefresh.emit();
    }
    console.log(this)
  }

  onCenterChanged(event) {
    if(this.centerChanged) {
      this.centerChanged.emit(event);
    }
  }

  add(event) {
    if (this.onAdd) {
      // this.onAdd.emit(event);
    }
  }

  updateProductsDisplayedInPage($event) {

  }

  canAddItem() {
    /*
    if (!this.item) {
      return false;
    }

    return (this.loggedIn && (this.item.public || this.ownItem));
     */
    return this.allowAddingItems;
  }

  canAddView() {
    return this.allowAddingViews;
  }

  onEdit(event): void {
    const dialogRef = this.dialog.open(EditItemComponent, {
      width: '400px',
      data: {item: this.item}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.itemService.update(result.id, result).subscribe(res => {
        this.refresh();
      });
    });
  }

  onDelete(event) {

  }

  canEditOrDeleteItem() : boolean {
    return this.ownItem;
  }

  onAdd(event): void {
    this.addItem({});
  }

  onRefreshClick() {
    this.refresh();
  }

  addItem(options) {
    //console.log(event);
    if (this.canAddItem()) {

      const createData = {};

      createData['parent_id'] = this.item.id;
      createData['public'] = this.item.visibility === 'visible';

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
                this.refresh();
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
    }
  }

  onAddView(event) {
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
  }

  onSaveViews() {
    if (this.item && (this.allowAddingViews || this.allowEditingViews)) {
      const props = Object.assign(this.item.attributes || {}, { views: this.views });
      console.log('item service update should be called here')
      this.itemService.update(this.item.id, {attributes: props}).subscribe(res => {
        this.refresh();
      });
    } else {
      this.refresh();
    }
  }

  onChangeTab(event) {
    this.selectedTab = event.index;
  }

  onEditView(index: number) {
    const view = this.views[index];
    console.log('before, view',view)

    const dialogRef = this.dialog.open(EditViewComponent, {
      width: '400px',
      data: view
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.views[index] = result;
        console.log('after, view',view)
        this.onSaveViews();
      }
    });
  }

  onDeleteView(index: number) {
    this.views.splice(index, 1);
    this.onSaveViews();
  }
}
