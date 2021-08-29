import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Item, ItemService, Query} from "../services/item.service";
import {MatDialog} from "@angular/material/dialog";
import {EditQueryComponent} from "../edit-query/edit-query.component";
import {EditViewComponent} from "../edit-view/edit-view.component";
import {CreateItemComponent} from "../create-item/create-item.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LngLat} from "mapbox-gl";
import {ActivatedRoute, Router} from "@angular/router";
import {LayoutComponent} from "../layout/layout.component";
import {EditItemComponent} from "../edit-item/edit-item.component";
import {BreakpointObserver} from "@angular/cdk/layout";
import {AuthService} from "../services/auth.service";


@Component({
  selector: 'app-app-view',
  templateUrl: './app-view.component.html',
  styleUrls: ['./app-view.component.scss']
})
export class AppViewComponent implements OnInit {

  loading = false;
  loggedIn = false;

  defaultQuery = { radius: 500, around: true, myItems: true };


  selectedView = new FormControl(0);
  selectedTab = 0;
  @Input() views = [{name: 'Items', type: 'List', icon: 'view_list'}];
  @Input() item: Item  = null;
  @Input() id: string  = null;
  @Input() items = [];
  @Input() detectLocation = false;
  @Input() allowAddingItems = false;
  @Input() allowAddingViews = false;
  @Input() allowEditingViews = false;
  @Input() itemContainer = false;
  @Input() query: Query = this.defaultQuery;
  @Output() onResults: EventEmitter<any> = new EventEmitter();
  @Output() onRefresh: EventEmitter<any> = new EventEmitter();
  paginatorSize = 20;
  numberOfProductsDisplayedInPage = 20;

  uploadProgress = 0;
  uploadingFile = false;
  uploading = false;

  center = null;
  ownItem = false;
  location = new LngLat(0, 0);

  isSmallScreen = this.breakpointObserver.isMatched('(max-width: 599px)');

  constructor(private itemService: ItemService,
              private route: ActivatedRoute,
              private authService: AuthService,
              private router: Router,
              private layoutComponent: LayoutComponent,
              private breakpointObserver: BreakpointObserver,
              private snackBar: MatSnackBar,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.loggedIn = this.authService.isLoggedIn();
    if (this.itemContainer) {
      this.route.paramMap.subscribe(params => {
        this.id = params.get('id');
        if (this.id) {
          this.getItem(this.id);
        }
      });
    } else {
      if (this.detectLocation && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          if (position) {
            this.query.lat = position.coords.latitude;
            this.query.lng = position.coords.longitude;
            this.getItems();
          }
        });
      } else {
        this.getItems();
      }
    }
  }

  getItems() {
    this.loading = true;
    this.itemService.items(this.query).subscribe(items => {
      this.items = items;
      this.loading = false;
    });
  }

  getItem(id) {
    this.loading = true;
    this.itemService.getItem(id).subscribe(async item => {
      this.loading = false;
      if (!('ok' in item)) {
        console.log(item);

        if (this.loggedIn) {
          this.ownItem = await this.itemService.canUserEditItem(item.id);
        }

        let defaultViews = [{name: 'Content', type: 'Content', icon: 'preview' }, {name: 'Items', type: 'List', icon: 'view_list'}];

        switch (item.Type['name']) {
          case 'Image':
            defaultViews = [{name: 'Content', type: 'Content', icon: 'preview' }];
            break;
          case 'Video':
            defaultViews = [{name: 'Content', type: 'Content', icon: 'preview' }];
            break;
          case 'Document':
            defaultViews = [{name: 'Content', type: 'Content', icon: 'preview' }];
            break;
          case 'Scene':
            defaultViews = [{name: 'Content', type: 'Content', icon: 'preview' }];
            break;
          default:
            if (item && item.properties && item.properties['query']) {
              this.query = item.properties['query'];
            }

            if (item.Type['name'] === 'Folder') {
              defaultViews = [{name: 'Items', type: 'List', icon: 'view_list'}];
            }

            const query = Object.assign({}, this.query);
            query.parentId = item.id;
            this.loading = true;
            this.itemService.items(query).subscribe(items => {
              // console.log(items);
              this.items = items;
              this.loading = false;
            });
            break;
        }
        this.item = item;
        if (this.item && this.item.properties) {
          if (this.item.properties['views']) {
            this.views = this.item.properties['views'];
          } else {
            this.views = defaultViews;
          }
        } else {
          this.views = defaultViews;
        }

        if (this.item && this.item.point) {
          this.location = this.item.point['coordinates'];
          this.center = this.location;
        }
        // console.log(iframely);
        // iframely.load(this.link.nativeElement, this.item.link);
        //this.appService.setTitle(item.name);
        /*
        this.appService.setItem(item);
        this.itemService.items(this.appService.getQuery()).subscribe(items => {
          this.appService.setItems(items);
        });
         */
      }
    });
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

  onEditQueryClick(event) {
    const dialogRef = this.dialog.open(EditQueryComponent, {
      width: '400px',
      data: { query: this.query}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.query = result;
        this.getItems();
        if (result.save) {
        } else if (result.run) {
        }
      }
    });
  }

  getQuery() {
    if (this.item && this.item.properties && this.item.properties['query']) {
      return this.item.properties['query'];
    } else {
      return this.query;
    }
  }

  getQueryString() {
    return this.itemService.getQueryString(this.getQuery());
  }

  onBack() {
    if (this.item && this.item.parent_id) {
      this.router.navigate(['/items', this.item.parent_id]);
    } else {
      this.router.navigate([this.layoutComponent.currentNavGroup]);
    }
  }

  onChangeTab(event) {
    this.selectedTab = event.index;
  }

  onEditView(index: number) {
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
  }

  onDeleteView(index: number) {
    this.views.splice(index, 1);
    this.onSaveViews();
  }

  refresh() {
    if (this.itemContainer) {
      this.getItem(this.id);
    } else {
      this.getItems();
    }
  }

  onRefreshClick() {
    this.refresh();
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

  onCenterChanged(event) {
    console.log('onCenterChanged', event);
    this.center = event;
  }

  onAdd(event): void {
    this.addItem({});
  }

  addItem(options) {
    //console.log(event);
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
      const props = Object.assign(this.item.properties || {}, { views: this.views });
      this.itemService.update(this.item.id, {properties: props}).subscribe(res => {
        this.refresh();
      });
    } else {
      this.refresh();
    }
  }
}
