import { L } from '@angular/cdk/keycodes';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, ViewChild, ViewChildren, QueryList, OnDestroy, SecurityContext } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { stringify } from 'querystring';
import { Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EditViewComponent } from '../edit-view/edit-view.component';
import { QrCodeComponent } from '../qr-code/qr-code.component';
import { RnDialogComponent } from '../rn-dialog/rn-dialog.component';
import { RnMsgBoxComponent } from '../rn-msg-box/rn-msg-box.component';
import { AuthService } from '../services/auth.service';
import { Item, ItemEvent, itemIsInstanceOf, ItemService } from '../services/item.service';
import { SessionService } from '../services/session.service';
import { ViewContainerRef } from '@angular/core';


@Component({
  selector: 'app-rn-view',
  templateUrl: './rn-view.component.html',
  styleUrls: ['./rn-view.component.sass']
})
export class RnViewComponent implements OnInit, OnChanges {

  @Input() view?: Item;
  @Input() items: Item[] = [];
  @Input() item?: Item;
  @Input() events?: Observable<number>;
  @Input() tabIndex?: number;
  @Output() onEvent = new EventEmitter<ItemEvent>();
  
  public isControl: boolean = false;

  uploadProgress = 0;
  uploadingFile = false;
  uploading = false;

  constructor(protected itemService: ItemService, 
              protected sessionService: SessionService,
              protected authService: AuthService,
              protected sanitizer: DomSanitizer,
              protected route: ActivatedRoute,
              protected dialog: MatDialog,
              protected snackBar: MatSnackBar,
              public viewContainerRef: ViewContainerRef) { }

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
    //console.log(event);
    
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

  onViewEventHandler(event: string) {
    console.log('event received by ', this);
  }

  isExternalType(item: Item): boolean {
    if (item.type && item.type.module) {
      return true;
    }
    return false;
  }

  openQRCodeDialog(item?: Item) {
    const dialogRef = this.dialog.open(QrCodeComponent, {
      width: '400px',
      data: { code: environment['home'] + '/items/' + (this.item? this.item.id : ''), name: this.item? this.item.name : 'realnet' }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  onQRCode() {
    this.openQRCodeDialog(this.item);
  }

  openEditDialog(item?: Item): void {
    this.onEventHandler({event: 'edit', item: item});
  }

  editDialog(): void {
    this.openEditDialog(this.item);
  }

  openDeleteDialog(item?: Item): void {
    this.onEventHandler({event: 'delete', item: item});
  }

  deleteDialog(): void {
    this.openDeleteDialog(this.item);
  }

  trimItemName(itemName: String) {
    if (itemName && itemName.length > 17) {
      return itemName.substring(0, 14) + '...';
    }
    return itemName;
  }

  extractParentRelativeLink(item?: Item): string {
    if (item && item.id) {
/*
      if(item.parent_id) {
        return '/items/' + item.parent_id + '/items/' + item.id;
      }
*/
      return '/items/' + item.id;
    }
    return '';
  }

  extractDataLink(item?: Item): string {
    if (item) {
      const link = this.itemService.getDataLink(item.id!);
      if (link) {
        const sanitized = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, this.sanitizer.bypassSecurityTrustResourceUrl(link));
        if (sanitized) {
          return sanitized;
        }
      }
    }
    
    return '';
  }

  getDataLink(): string {
    return this.extractDataLink(this.item);
  }

  extractLink(item?: Item): string {
    return item? this.itemService.getLink(item) : '';
  }

  getLink(): string {
    return this.extractLink(this.item);
  }

  extractLinkedItemId(item?: Item): string {
    return item? this.itemService.getLinkedItemId(item) : '';
  }

  getLinkedItemId(): string {
    return this.extractLinkedItemId(this.item);
  }

  linkCheck(item?: Item) : boolean {
    return item? this.itemService.isLink(item) : false;
  }

  isLink(): boolean {
    return this.linkCheck(this.item);
  }

  itemLinkCheck(item?: Item) : boolean {
    return item? this.itemService.isInternalLink(item) : false;
  }

  isItemLink(): boolean {
    return this.itemLinkCheck(this.item);
  }

  isCtrlView(item: Item) {
    return itemIsInstanceOf(item, "CtrlView");
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
                width: '95vw',
                height: '95vh',
                data: {item: this.item, view: dialog.items[0]}
              });
      
              dialogRef.afterClosed().subscribe(result => {
                if (result) {
                  console.log(result);
                  this.uploading = true;
        
                  if (result.file) {
                    this.uploadingFile = true;
                    this.uploadProgress = 0;
                  }
                  
                  if (this.item) {
                    result.data['parent_id'] = this.item.id;
                  }
                  console.log(result.data);
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

  importFile(event: any) {
    if (this.item && this.item.id) {
      this.itemService.importFile(this.item.id, event.target.files[0]).subscribe(
        (event: HttpEvent<Object>) => {
          if (event.type === HttpEventType.UploadProgress) {
            if (event.total) {
              let uploadProgress = Math.round(event.loaded / event.total * 100);
              console.log(`Uploaded! ${uploadProgress}%`);
            }
            
            /*
            if (progressFn) {
              progressFn(uploadProgress);
            }*/
            //this.snackBar.open("File uploaded");
          } else if (event.type === HttpEventType.Response) {
            //console.log(event);
            if (event.status === 200 || event.status === 201) {
              this.sessionService.refresh();
            }
            this.snackBar.open(event.statusText);
            
          } else {
            console.log(event);
            this.snackBar.open("File uploaded");
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
    console.log(event);
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result) {
        if ('item' in event) {
          this.uploading = true;
          this.itemService.delete(event['item']['id']!).subscribe(res => {
            this.sessionService.refresh();;
          });
        }
      }
    });
  }

  onEdit(event: any) {
    //console.log(event);
    this.itemService.dialogs().subscribe(dialogs => {
      if (dialogs) {
        const editDialogs = dialogs.filter(d => itemIsInstanceOf(d, 'ItemEditDialog'));

        if (editDialogs) {
          const dialog = editDialogs[0];

          if (dialog && dialog.items && 'item' in event) {
            let target = event['item'];
            //console.log(target);
            if (target) {
              const dialogRef = this.dialog.open(RnDialogComponent, {
                width: '95vw',
                height: '95vh',
                data: {item: target, view: dialog.items[0]}
              });
    
              dialogRef.afterClosed().subscribe(result => {
                if (result) {
                  console.log(result);
                  this.uploading = true;
        
                  if (result.file) {
                    this.uploadingFile = true;
                    this.uploadProgress = 0;
                  }
                  //console.log(result);
                  const arg = Object.assign({id: target.id},result.data);
                  //console.log(arg);
                  this.itemService.update(arg.id, arg).subscribe(res => {
                    this.sessionService.refresh();
                  });
                }
              });
            }
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
