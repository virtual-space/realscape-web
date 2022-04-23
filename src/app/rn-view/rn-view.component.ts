import { L } from '@angular/cdk/keycodes';
import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { stringify } from 'querystring';
import { environment } from 'src/environments/environment';
import { EditViewComponent } from '../edit-view/edit-view.component';
import { QrCodeComponent } from '../qr-code/qr-code.component';
import { RnDialogComponent } from '../rn-dialog/rn-dialog.component';
import { RnMsgBoxComponent } from '../rn-msg-box/rn-msg-box.component';
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

  uploadProgress = 0;
  uploadingFile = false;
  uploading = false;

  @ViewChildren(RnViewComponent) itemViews!: QueryList<RnViewComponent>;

  constructor(protected itemService: ItemService, 
              protected sessionService: SessionService, 
              protected route: ActivatedRoute,
              protected dialog: MatDialog,
              protected snackBar: MatSnackBar) { }

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
    
    if (event.event) {
       if(event.event == 'edit') {
          this.onEdit(event);
       } else if(event.event == 'new') {
          this.onAdd(event);
      } else if(event.event == 'delete') {
        this.onDelete(event);
      }
    }

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

  onQRCode() {
    const dialogRef = this.dialog.open(QrCodeComponent, {
      width: '400px',
      data: { code: environment['home'] + '/items/' + (this.item? this.item.id : ''), name: this.item? this.item.name : 'Realnet' }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  editDialog(): void {
    this.onEventHandler({event: 'edit', item: this.item});
  }

  deleteDialog(): void {
    this.onEventHandler({event: 'delete', item: this.item});
  }

  trimItemName(itemName: String) {
    if (itemName && itemName.length > 17) {
      return itemName.substring(0, 14) + '...';
    }
    return itemName;
  }

  getLink(): string {
    return this.item? this.itemService.getLink(this.item) : '';
  }

  getLinkedItemId(): string {
    return this.item? this.itemService.getLinkedItemId(this.item) : '';
  }

  isLink(): boolean {
    return this.item? this.itemService.isLink(this.item) : false;
  }

  isItemLink(): boolean {
    return this.item? this.itemService.isInternalLink(this.item) : false;
  }

  canAddItem(): boolean {
    return true;
  }

  onAdd(event: any) {
    if (this.canAddItem()) {

      this.itemService.dialogs().subscribe(dialogs => {
        if (dialogs) {
          const createDialogs = dialogs.filter(d => itemIsInstanceOf(d, 'ItemCreateDialog'));

          if (createDialogs) {
            const dialog = createDialogs[0];

            if (dialog && dialog.items) {
              const dialogRef = this.dialog.open(RnDialogComponent, {
                width: '400px',
                data: {item: this.item, view: dialog.items[0]}
              });
      
              dialogRef.afterClosed().subscribe(result => {
                if (result) {
                  this.uploading = true;
        
                  if (result.file) {
                    this.uploadingFile = true;
                    this.uploadProgress = 0;
                  }

                  if (this.item) {
                    if (itemIsInstanceOf(this.item, "HomeApp")) {
                      result.data['home'] = 'true';
                    } else {
                      result.data['parent_id'] = this.item.id;
                    }
                  }
        
                  this.itemService.create(result.data, (progress) => { this.uploadProgress = progress }).subscribe(
                    (res) => {
                      if (res && res['id']) {
                        console.log(`Success created item id: ${res['id']}`);
                        this.sessionService.refresh();
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
                      this.sessionService.refresh();
                    });
                }
              });
            }
            } 
          }
      });
  
    }
  }

  onAddView(event: any) {
    const dialogRef = this.dialog.open(EditViewComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      //TODO: Create view
      /*
      if (result) {
        this.views.push(result);
        this.selectedView.setValue(this.views.length - 1);
        this.onSaveViews();
      }*/
    });
  }

  onDelete(event: any) {
    const dialogRef = this.dialog.open(RnMsgBoxComponent, {
      width: '400px',
      data: {title: 'Delete item', message: 'Warning you are about to delete an item. Are you sure you want to do this?'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        if (this.item) {
          this.uploading = true;
          this.itemService.delete(this.item.id!).subscribe(res => {
            this.sessionService.refresh();;
          });
        }
      }
    });
  }

  onEdit(event: any) {

    this.itemService.dialogs().subscribe(dialogs => {
      if (dialogs) {
        const editDialogs = dialogs.filter(d => itemIsInstanceOf(d, 'ItemEditDialog'));

        if (editDialogs) {
          const dialog = editDialogs[0];

          if (dialog && dialog.items) {
            const dialogRef = this.dialog.open(RnDialogComponent, {
              width: '400px',
              data: {item: this.item, view: dialog.items[0]}
            });
  
            dialogRef.afterClosed().subscribe(result => {
              if (result) {
                this.uploading = true;
      
                if (result.file) {
                  this.uploadingFile = true;
                  this.uploadProgress = 0;
                }
                console.log(result);
                const arg = Object.assign({id: this.item?.id},result.data)
                this.itemService.update(arg.id, arg).subscribe(res => {
                  this.sessionService.refresh();
                });
              }
            });
          }
        }
      } 
    });
    
  }

  canAddView(): boolean {
    return true;
  }

  canEditOrDeleteItem(): boolean {
    return true;
  }

  onRefreshClick(): void {
    this.sessionService.refresh();
  }

}
