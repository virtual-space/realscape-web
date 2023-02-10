import { L } from '@angular/cdk/keycodes';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, SecurityContext } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { QrCodeComponent } from '../qr-code/qr-code.component';
import { RnDialogComponent } from '../rn-dialog/rn-dialog.component';
import { RnMsgBoxComponent } from '../rn-msg-box/rn-msg-box.component';
import { AuthService } from '../services/auth.service';
import { Item, ItemEvent, itemIsInstanceOf, ItemService, Query } from '../services/item.service';
import { ViewContainerRef } from '@angular/core';
import { RnCtrlComponent, ItemCallbacks } from '../rn-ctrl/rn-ctrl.component';
import { basename } from 'path';

@Component({
  selector: 'app-rn-view',
  templateUrl: './rn-view.component.html',
  styleUrls: ['./rn-view.component.sass']
})
export class RnViewComponent extends RnCtrlComponent implements OnInit, OnChanges, ItemCallbacks {

  private _items: Item[] = [];

  @Input() set items(value: Item[]) {
    this._items = value;
    this.itemsChanged(this._items);
  }
  get items(): Item[] {
    // other logic
    return this._items;
  }
  @Input() view?: Item;
  @Output() onQueryChanged = new EventEmitter<any>();

  public isControl: boolean = false;

  uploadProgress = 0;
  uploadingFile = false;
  uploading = false;

  

  protected override initialize(): void {
    if (this.view) {
      this.isControl = itemIsInstanceOf(this.view, "CtrlView");
      this.controls = this.getItemControls(this.view);
    } 
  }

  getIcon(item: Item) {
    return this.itemService.getIcon(item);
  }

  getItemViewTarget(items: Item[]): Item | undefined {
    //////console.logog(this);
    if (this.view && this.view.attributes) {
      //////console.logog(this.view.attributes);
      //////console.logog('select_name' in this.view.attributes);
      //////console.logog(this.view.attributes['select_name']);
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
        //////console.logog('select ', select_name, select_type, result);
        return result;
    }
    return undefined;
  }

  

  updateItems(items: Item[]) {

  }

  override onEventHandler(event: ItemEvent) {
    //console.logog('*** onEventHandler ', this, event);
    
    if (event.event) {
       if(event.event == 'edit' && event.item) {
          this.onEdit(event.item);
       } else if(event.event == 'new') {
          this.onAdd(event.item);
      } else if(event.event == 'delete' && event.item) {
        this.onDelete(event.item);
      }
    }
  }

  onViewEventHandler(event: string) {
    ////console.logog('event received by ', this);
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
      data: { code: environment['home'] + '/items/' + (item? item.id : ''), name: item? item.name : 'realnet' }
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
      //console.log(this.extractLinkedItemResource(item) );
      return '/' + this.extractLinkedItemResource(item) + '/' + item.id;
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

  getItemLink(item: Item): string {
    return this.extractLink(item);
  }

  extractLinkedItemId(item?: Item): string {
    return item? this.itemService.getLinkedItemId(item) : '';
  }

  extractLinkedItemResource(item?: Item): string {
    return item? this.itemService.getLinkedItemResource(item) : 'items';
  }

  getLinkedItemId(): string {
    return this.extractLinkedItemId(this.item);
  }

  getItemLinkedItemId(item: Item): string {
    return this.extractLinkedItemId(item);
  }

  linkCheck(item?: Item) : boolean {
    return item? this.itemService.isLink(item) : false;
  }

  isLink(): boolean {
    return this.linkCheck(this.item);
  }

  isLinkItem(item: Item): boolean {
    return this.linkCheck(item);
  }

  itemLinkCheck(item?: Item) : boolean {
    return item? this.itemService.isInternalLink(item) : false;
  }

  isItemLink(): boolean {
    return this.itemLinkCheck(this.item);
  }

  isItemLinkItem(item: Item): boolean {
    return this.itemLinkCheck(item);
  }

  isCtrlView(item: Item) {
    return itemIsInstanceOf(item, "CtrlView");
  }

  canAddItem(): boolean {
    return true;
  }

  onAdd(item?: Item) {
    if (this.canAddItem()) {
      
      //console.logog('onAdd:',item);
      //console.logog('onAddItems:', item!.type)
      const target_item = item? item : new Item();
      ////console.logtarget_item);
      this.presentForm('Add', false, false, null, target_item, this.view!);
      /*
      if(item) {
        const form = this.getItemForm(item, "add");
        if (form) {
          const target_item = item? item : new Item();
          if (this.item && !itemIsInstanceOf(this.item, 'App')) {
            target_item.parent_id = this.item.id;
          }
          ////console.logog(target_item);
          this.dialog.open(RnDialogComponent, {
            width: '95vw',
            height: '75vh',
            data: {item: target_item, view: form }
          });
        }
      }*/
  
    }
  }

  onDisplay(item?: Item) {
    if (item) {
      //////console.logog(item);
      this.dialog.open(RnDialogComponent, {
        width: '95vw',
        height: '75vh',
        data: {item: item }
      });
  
    }
  }

  onAddLink(item?: Item) {
    if (this.canAddItem()) {
      //////console.logog(item);
      const forms = this.itemService.getForms();
      if(forms) {
        const form = forms.filter(d => d.name === 'LinkItem');
        //console.logog(form);
        if (form) {
          const target_item = item? item : new Item();
          if (this.item && !itemIsInstanceOf(this.item, 'App')) {
            target_item.parent_id = this.item.id;
          }
          ////console.logog(target_item);
          this.dialog.open(RnDialogComponent, {
            width: '95vw',
            height: '75vh',
            data: {item: target_item, view: form[0] }
          });
        }
      }
  
    }
  }

  onEdit(item: Item) {
    /////console.logog(event);
    if(this.canEditOrDeleteItem()) {
      ////console.logog('onEdit:',item);
      ////console.logog('onEditItem:', item!.type)
      const form = this.getItemForm(item, "edit");
      if (form) {
        ////console.logog(target_item);
        this.dialog.open(RnDialogComponent, {
          width: '95vw',
          height: '75vh',
          data: {item: item, view: form }
        });
      }
    }
  }

  onEditView(item: Item) {
    if(this.canEditOrDeleteView()) {
      const dialogs = this.itemService.getDialogs();
      if (dialogs) {
        const editDialogs = dialogs.filter(d => itemIsInstanceOf(d, 'ItemEditDialog'));

        if (editDialogs) {
          const dialog = editDialogs[0];

          if (dialog && dialog.items) {
            const form = dialog.items.find(d => itemIsInstanceOf(d, 'Ctrl'));
            if (form) {
              const target_view = this.getItemViews(this.item!).find(v => v.name === item.name && v.type!.name === item.type!.name!);
              if(target_view) {
                target_view.attributes = Object.assign(target_view.attributes? target_view.attributes : {}, {host: this.item!})
                this.dialog.open(RnDialogComponent, {
                  width: '95vw',
                  height: '75vh',
                  data: {item: target_view, view: form}
                });
                /*
                dialogRef.afterClosed().subscribe(result => {
                  if (result) {
                    ////console.logog(result);
                    this.uploading = true;
          
                    if (result.file) {
                      this.uploadingFile = true;
                      this.uploadProgress = 0;
                    }
                    
                    let views = this.getItemViews(this.item!).map(v => { return {name: v.name, type: v.type!.name, attributes: v.attributes}});
                    const view = views.find(v => v.name === item.name && v.type === item.type!.name!);
                    ////console.logog(view);
                    if(view) {
                      view.name = result.data.name;
                      view.type = result.item.type.name;
                      view.attributes = result.data.attributes;
                    }
                    
                    let attr_data = Object.assign(this.item!.attributes, {views: views})
                    this.itemService.update(this.item!.id!,{attributes: attr_data} ).subscribe(
                        (res) => {
                          if (res && res['id']) {
                            ////console.logog(`Success created item id: ${res['id']}`);
                            if(this.onRefresh) {
                              this.onRefresh.emit();
                            }
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
                          if(this.onRefresh) {
                            this.onRefresh.emit();
                          }
                        });
                  }
                });*/
              }
            }
          }
        }
      } 
    }
    
  }

  onEditQuery(item: Item) {
    if(this.canEditOrDeleteItem()) {
      const dialogs = this.itemService.getDialogs();
      if (dialogs) {
        const editDialogs = dialogs.filter(d => itemIsInstanceOf(d, 'ItemEditDialog'));

        if (editDialogs) {
          const dialog = editDialogs[0];

          if (dialog && dialog.items) {
            const form = dialog.items.find(d => itemIsInstanceOf(d, 'Ctrl'));
            const item_query = this.getItemQuery(item);
            if (form) {
              let query = this.itemFromQuery(item_query ? item_query : new Item() );
              query.attributes = Object.assign(query.attributes? query.attributes : {}, {host: this.item!})
              this.dialog.open(RnDialogComponent, {
                width: '95vw',
                height: '75vh',
                data: {item: query, view: form}
              });
              /*
              dialogRef.afterClosed().subscribe(result => {
                if (result) {
                  ////console.logog(result);
                  this.uploading = true;
        
                  if (result.file) {
                    this.uploadingFile = true;
                    this.uploadProgress = 0;
                  }
                  let result_item: Item = {...result.data};
                  if ('types' in result.data) {
                    result_item.attributes = Object.assign(result_item.attributes? result_item.attributes : {}, {types: result.data['types']});
                  }      
                  let attr_data = Object.assign(this.item!.attributes, {query: this.queryFromItem(result_item)});
                  this.itemService.update(this.item!.id!,{attributes: attr_data} ).subscribe(
                      (res) => {
                        if (res && res['id']) {
                          ////console.logog(`Success updated item id: ${res['id']}`);
                          if(this.onRefresh) {
                            this.onRefresh.emit();
                          }
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
                        if(this.onRefresh) {
                          this.onRefresh.emit();
                        }
                      });
                }
              });*/
            }
          }
        }
      } 
    }
    
  }

  onEditViewQuery(item: Item) {
    if(this.canEditOrDeleteView()) {
      const dialogs = this.itemService.getDialogs();
      if (dialogs) {
        const editDialogs = dialogs.filter(d => itemIsInstanceOf(d, 'ItemEditDialog'));

        if (editDialogs) {
          const dialog = editDialogs[0];

          if (dialog && dialog.items) {
            const form = dialog.items.find(d => itemIsInstanceOf(d, 'Ctrl'));
            if (form) {
              const target_view = this.getItemViews(this.item!).find(v => v.name === item.name && v.type!.name === item.type!.name!);
              if(target_view) {
                const view_query = this.getItemQuery(target_view);
                const query = this.itemFromQuery(view_query ? view_query : new Item());
                this.dialog.open(RnDialogComponent, {
                  width: '95vw',
                  height: '75vh',
                  data: {item: query, view: form}
                });
                /*
                dialogRef.afterClosed().subscribe(result => {
                  if (result) {
                    ////console.logog(result);
                    this.uploading = true;
          
                    if (result.file) {
                      this.uploadingFile = true;
                      this.uploadProgress = 0;
                    }

                    let result_item: Item = {...result.data};
                    if ('types' in result.data) {
                      result_item.attributes = Object.assign(result_item.attributes? result_item.attributes : {}, {types: result.data['types']});
                    }                            
                    let views = this.getItemViews(this.item!).map(v => { return {name: v.name, type: v.type!.name, attributes: v.attributes}});
                    const view = views.find(v => v.name === item.name && v.type === item.type!.name!);
                    ////console.logog(view);
                    if(view) {
                      view.attributes = Object.assign(view.attributes? view.attributes : {}, {query: this.queryFromItem(result_item)});
                    }
                    
                    let result_views: any[] = [];
                    views.forEach(v => {
                      let result_view: any = {}
                      result_view['name'] = v.name;
                      result_view['type'] = v.type;
                      if (v.attributes && 'query' in v.attributes) {
                        result_view['query'] = v.attributes['query'];
                      }
                      result_views.push(result_view);
                    });
                    let attr_data = Object.assign(this.item!.attributes, {views: result_views});
                    this.itemService.update(this.item!.id!,{attributes: attr_data} ).subscribe(
                        (res) => {
                          if (res && res['id']) {
                            ////console.logog(`Success created item id: ${res['id']}`);
                            if(this.onRefresh) {
                              this.onRefresh.emit();
                            }
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
                          if(this.onRefresh) {
                            this.onRefresh.emit();
                          }
                        });
                  }
                });*/
              }
            }
          }
        }
      } 
    }
    
  }

  importFile(event: any) {
    if (this.item && this.item.id) {
      this.itemService.importFile(this.item.id, event.target.files[0]).subscribe(
        (event: HttpEvent<Object>) => {
          if (event.type === HttpEventType.UploadProgress) {
            if (event.total) {
              let uploadProgress = Math.round(event.loaded / event.total * 100);
              ////console.logog(`Uploaded! ${uploadProgress}%`);
            }
            
            /*
            if (progressFn) {
              progressFn(uploadProgress);
            }*/
            //this.snackBar.open("File uploaded");
          } else if (event.type === HttpEventType.Response) {
            //////console.logog(event);
            if (event.status === 200 || event.status === 201) {
              if(this.onRefresh) {
                this.onRefresh.emit();
              }
            }
            this.snackBar.open(event.statusText);
            
          } else {
            ////console.logog(event);
            this.snackBar.open("File uploaded");
          }
        });
    }
    
  }

  onAddView(item?: Item) {
    if (this.item && this.canAddView()) {
      //////console.logog(item);
      const dialogs = this.itemService.getDialogs();
      if (dialogs) {
        const createDialogs = dialogs.filter(d => itemIsInstanceOf(d, 'ItemCreateDialog'));

        if (createDialogs) {
          const dialog = createDialogs[0];

          if (dialog && dialog.items) {

            const form = dialog.items.find(d => itemIsInstanceOf(d, 'Ctrl'));
            if (form) {
              const view_item = new Item();
              view_item.attributes = Object.assign({types: ["View"]}, {host: this.item!});
              view_item.name = "New ListView";
              view_item.type = this.itemService.getTypes().find(t => t.name === 'ListView');
              ////console.logog(view_item);
              this.dialog.open(RnDialogComponent, {
                width: '95vw',
                height: '75vh',
                data: {item: view_item, view: form }
              });
              /*
              dialogRef.afterClosed().subscribe(result => {
                if (result) {
                  ////console.logog(result);
                  this.uploading = true;
        
                  if (result.file) {
                    this.uploadingFile = true;
                    this.uploadProgress = 0;
                  }
                  
                  let views = this.getItemViews(this.item!).map(v => { return {name: v.name, type: v.type!.name, attributes: v.attributes}})
                                  .concat({name: result.data['name'], type:  result.data['type'], attributes: result.data['attributes']});
                  ////console.logog(views);

                  let attr_data = Object.assign(this.item!.attributes, {views: views})
                  this.itemService.update(this.item!.id!,{attributes: attr_data} ).subscribe(
                      (res) => {
                        if (res && res['id']) {
                          ////console.logog(`Success created item id: ${res['id']}`);
                          if(this.onRefresh) {
                            this.onRefresh.emit();
                          }
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
                        if(this.onRefresh) {
                          this.onRefresh.emit();
                        }
                      });
                }
              });*/
            }
          }
        } 
      }
  
    }
  }

  onDelete(item: Item) {
    const dialogRef = this.dialog.open(RnMsgBoxComponent, {
      width: '400px',
      data: {title: 'Delete item', message: 'Warning you are about to delete an item. Are you sure you want to do this?'}
    });
    
    if( item && item.id) {
      dialogRef.afterClosed().subscribe(result => {
        ////console.logog(result);
        if(result) {
          this.uploading = true;
            this.itemService.delete(item.id!).subscribe(res => {
              if(this.onRefresh) {
                this.onRefresh.emit();
              }
            });
        }
      });
    }
    
  }

  onDeleteView(item: Item) {
    if( item && this.canEditOrDeleteView()) {
      const dialogRef = this.dialog.open(RnMsgBoxComponent, {
        width: '400px',
        data: {title: 'Delete item', message: 'Warning you are about to delete a view. Are you sure you want to do this?'}
      });
  
      ////console.logog(item);
      ////console.logog(this.getItemViews(this.item!));
      const target_view = this.getItemViews(this.item!).find(v => v.name === item.name && v.type!.name === item.type!.name!);
      if(target_view) {
        dialogRef.afterClosed().subscribe(result => {
          let views = this.getItemViews(this.item!).filter(v => !(v.name === item.name && v.type!.name === item.type!.name!))
                    .map(v => { return {name: v.name, type: v.type!.name, attributes: v.attributes}});
                    ////console.logog(views);

          let attr_data = Object.assign(this.item!.attributes, {views: views});

          if(result) {
            this.uploading = true;
             this.itemService.update(this.item!.id!,{attributes: attr_data} ).subscribe(
                        (res) => {
                          if(this.onRefresh) {
                            this.onRefresh.emit();
                          }
              });
          }
        });
      }
    }
    
  }
  

  canAddView(): boolean {
    return true;
  }

  canEditOrDeleteItem(): boolean {
    return true;
  }

  canEditOrDeleteView(): boolean {
    return true;
  }

  override itemsChanged(items?: Item[]): void {
    //console.log('*************************************** hello from view items changed!!! ', items);
  }

  override ngOnChanges(changes: SimpleChanges): void {
    if(changes['control']) {
      this.controlChanged(this.control);
     } else if(changes['item']) {
       this.itemChanged(this.item);
     } else if(changes['items']) {
       this.itemsChanged(this.items);
     }
  }

  queryChangedHandler(event: any) {
    //console.log(event);
    if (this.onQueryChanged) {
      this.onQueryChanged.emit(event);
    }
  }

}
