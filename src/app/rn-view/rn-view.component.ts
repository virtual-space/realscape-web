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
  @Output() onRefresh = new EventEmitter();
  
  public isControl: boolean = false;

  uploadProgress = 0;
  uploadingFile = false;
  uploading = false;

  constructor(protected itemService: ItemService,
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

  getIcon(item: Item) {
    return this.itemService.getIcon(item);
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
    console.log('*** onEventHandler ', this, event);
    
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

  onAdd(item?: Item) {
    if (this.canAddItem()) {
      //console.log(item);
      this.itemService.dialogs().subscribe(dialogs => {
        if (dialogs) {
          const createDialogs = dialogs.filter(d => itemIsInstanceOf(d, 'ItemCreateDialog'));

          if (createDialogs) {
            const dialog = createDialogs[0];

            if (dialog && dialog.items) {

              const form = dialog.items.find(d => itemIsInstanceOf(d, 'FormCtrl'));
              if (form) {
                const dialogRef = this.dialog.open(RnDialogComponent, {
                  width: '95vw',
                  height: '75vh',
                  data: {item: item? item : {}, view: form }
                });
        
                dialogRef.afterClosed().subscribe(result => {
                  if (result) {
                    console.log(result);
                    this.uploading = true;
          
                    if (result.file) {
                      this.uploadingFile = true;
                      this.uploadProgress = 0;
                    }
                    
                    if (item) {
                      result.data['parent_id'] = item.id;
                    }
                    console.log(result.data);
                    this.itemService.create(result.data, (progress) => { this.uploadProgress = progress }).subscribe(
                      (res) => {
                        if (res && res['id']) {
                          console.log(`Success created item id: ${res['id']}`);
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
                });
              }
            }
          } 
        }
      });
  
    }
  }

  onAddLink(item?: Item) {
    if (this.canAddItem()) {
      //console.log(item);
      this.itemService.dialogs().subscribe(dialogs => {
        if (dialogs) {
          const createDialogs = dialogs.filter(d => itemIsInstanceOf(d, 'ItemLinkDialog'));

          if (createDialogs) {
            const dialog = createDialogs[0];

            if (dialog && dialog.items) {

              const form = dialog.items.find(d => itemIsInstanceOf(d, 'FormCtrl'));
              if (form) {
                const dialogRef = this.dialog.open(RnDialogComponent, {
                  width: '95vw',
                  height: '75vh',
                  data: {item: item? item : {}, view: form }
                });
        
                dialogRef.afterClosed().subscribe(result => {
                  if (result) {
                    console.log(result);
                    this.uploading = true;
          
                    if (result.file) {
                      this.uploadingFile = true;
                      this.uploadProgress = 0;
                    }
                    
                    if (item) {
                      result.data['parent_id'] = item.id;
                    }
                    console.log(result.data);
                    this.itemService.create(result.data, (progress) => { this.uploadProgress = progress }).subscribe(
                      (res) => {
                        if (res && res['id']) {
                          console.log(`Success created item id: ${res['id']}`);
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
                });
              }
            }
          } 
        }
      });
  
    }
  }

  onEdit(item: Item) {
    //console.log(event);
    if(this.canEditOrDeleteItem()) {
      this.itemService.dialogs().subscribe(dialogs => {
        if (dialogs) {
          const editDialogs = dialogs.filter(d => itemIsInstanceOf(d, 'ItemEditDialog'));
  
          if (editDialogs) {
            const dialog = editDialogs[0];
  
            if (dialog && dialog.items) {
              const form = dialog.items.find(d => itemIsInstanceOf(d, 'FormCtrl'));
              if (form) {
                const dialogRef = this.dialog.open(RnDialogComponent, {
                  width: '95vw',
                  height: '75vh',
                  data: {item: item, view: form}
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
                    let attrs = this.itemService.collectItemAttributes(this.item!, {});
                    if ('types' in result.data) {
                      attrs = Object.assign(attrs, {types: result.data.types});
                    }
                    console.log(attrs);
                    
                    let arg = Object.assign({id: item.id},{attributes: attrs});
                    arg = Object.assign(arg, result.data);
                    console.log(arg);
                    //console.log(arg);
                    this.itemService.update(arg.id!, arg).subscribe(res => {
                      if(this.onRefresh) {
                        console.log('refreshing',this);
                        this.onRefresh.emit();
                      }
                    });
                  }
                });
              }
            }
          }
        } 
      });
    }
  }

  onEditView(item: Item) {
    if(this.canEditOrDeleteView()) {
      this.itemService.dialogs().subscribe(dialogs => {
        if (dialogs) {
          const editDialogs = dialogs.filter(d => itemIsInstanceOf(d, 'ItemEditDialog'));
  
          if (editDialogs) {
            const dialog = editDialogs[0];
  
            if (dialog && dialog.items) {
              const form = dialog.items.find(d => itemIsInstanceOf(d, 'FormCtrl'));
              if (form) {
                const target_view = this.getItemViews(this.item!).find(v => v.name === item.name && v.type!.name === item.type!.name!);
                if(target_view) {
                  const dialogRef = this.dialog.open(RnDialogComponent, {
                    width: '95vw',
                    height: '75vh',
                    data: {item: target_view, view: form}
                  });
        
                  dialogRef.afterClosed().subscribe(result => {
                    if (result) {
                      console.log(result);
                      this.uploading = true;
            
                      if (result.file) {
                        this.uploadingFile = true;
                        this.uploadProgress = 0;
                      }
                      
                      let views = this.getItemViews(this.item!).map(v => { return {name: v.name, type: v.type!.name, attributes: v.attributes}});
                      const view = views.find(v => v.name === item.name && v.type === item.type!.name!);
                      console.log(view);
                      if(view) {
                        view.name = result.data.name;
                        view.type = result.item.type.name;
                        view.attributes = result.data.attributes;
                      }
                      
                      let attr_data = Object.assign(this.item!.attributes, {views: views})
                      this.itemService.update(this.item!.id!,{attributes: attr_data} ).subscribe(
                          (res) => {
                            if (res && res['id']) {
                              console.log(`Success created item id: ${res['id']}`);
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
                  });
                }
              }
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
              if(this.onRefresh) {
                this.onRefresh.emit();
              }
            }
            this.snackBar.open(event.statusText);
            
          } else {
            console.log(event);
            this.snackBar.open("File uploaded");
          }
        });
    }
    
  }

  onAddView(item?: Item) {
    if (this.item && this.canAddView()) {
      //console.log(item);
      this.itemService.dialogs().subscribe(dialogs => {
        if (dialogs) {
          const createDialogs = dialogs.filter(d => itemIsInstanceOf(d, 'ItemCreateDialog'));

          if (createDialogs) {
            const dialog = createDialogs[0];

            if (dialog && dialog.items) {

              const form = dialog.items.find(d => itemIsInstanceOf(d, 'FormCtrl'));
              if (form) {
                const dialogRef = this.dialog.open(RnDialogComponent, {
                  width: '95vw',
                  height: '90vh',
                  data: {item: item? item : {}, view: form }
                });
        
                dialogRef.afterClosed().subscribe(result => {
                  if (result) {
                    console.log(result);
                    this.uploading = true;
          
                    if (result.file) {
                      this.uploadingFile = true;
                      this.uploadProgress = 0;
                    }
                    
                    let views = this.getItemViews(this.item!).map(v => { return {name: v.name, type: v.type!.name, attributes: v.attributes}})
                                    .concat({name: result.data['name'], type:  result.data['type'], attributes: result.data['attributes']});
                    console.log(views);

                    let attr_data = Object.assign(this.item!.attributes, {views: views})
                    this.itemService.update(this.item!.id!,{attributes: attr_data} ).subscribe(
                        (res) => {
                          if (res && res['id']) {
                            console.log(`Success created item id: ${res['id']}`);
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
                });
              }
            }
          } 
        }
      });
  
    }
  }

  onDelete(item: Item) {
    const dialogRef = this.dialog.open(RnMsgBoxComponent, {
      width: '400px',
      data: {title: 'Delete item', message: 'Warning you are about to delete an item. Are you sure you want to do this?'}
    });
    
    if( item && item.id) {
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
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
  
      console.log(item);
      console.log(this.getItemViews(this.item!));
      const target_view = this.getItemViews(this.item!).find(v => v.name === item.name && v.type!.name === item.type!.name!);
      if(target_view) {
        dialogRef.afterClosed().subscribe(result => {
          let views = this.getItemViews(this.item!).filter(v => !(v.name === item.name && v.type!.name === item.type!.name!))
                    .map(v => { return {name: v.name, type: v.type!.name, attributes: v.attributes}});
                    console.log(views);

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

  getItemQuery(item: Item): Query | undefined {
    const attributes = this.itemService.collectItemAttributes(item, {});
    console.log(item, attributes);
    let query = undefined;
    if ('query' in attributes && Object.keys(attributes['query']).length > 0) {
        query = {... attributes['query']};
        //console.log(query);
    }
    return query;
  }
  

  getItemViews(item: Item): Item[] {
    const attributes = this.itemService.collectItemAttributes(item, {});
    if ('views' in attributes) {
      return attributes['views'].map((v:any) => {
        let item: Item = new Item();
        item.name = v['name'];
        if('query' in v) {
          item.attributes = {query: v['query']};
        }
        if('attributes' in v) {
          item.attributes = Object.assign(item.attributes? item.attributes : {}, v['attributes']);
        }
        const types = this.itemService.getTypes()
        if (types) {
          let type = types.find(t => t.name === v['type']);
          if (type) {
            item.type = type;
          }
        }
        return item;
      });
    }
    return []
  }

  getItemControls(item: Item): Item[] {
    const attributes = this.itemService.collectItemAttributes(item, {});
    if ('controls' in attributes) {
      return attributes['controls'].map((v:any) => {
        let item: Item = {... v};
        const type = this.itemService.getTypes().find(t => t.name === item.type);
        if (type) {
          item.type = type;
        }
        return item;
      });
    }
    return []
  }

  childRefresh() {
    if (this.onRefresh) {
      this.onRefresh.emit();
    }
  }

}
