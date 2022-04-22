import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Item, itemIsInstanceOf, ItemService } from '../services/item.service';
import { SessionService } from '../services/session.service';

import { EditViewComponent } from '../edit-view/edit-view.component';
import { RnCreateItemViewComponent } from '../rn-create-item-view/rn-create-item-view.component';
import { RnEditItemViewComponent } from '../rn-edit-item-view/rn-edit-item-view.component';
import { RnDialogComponent } from '../rn-dialog/rn-dialog.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent implements OnInit, OnDestroy {
  item?: Item;
  apps: Item[] = [];
  subscription?: Subscription;

  uploadProgress = 0;
  uploadingFile = false;
  uploading = false;

  constructor(private itemService: ItemService,
              private sessionService: SessionService,
              private snackBar: MatSnackBar,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.subscription = this.sessionService.itemActivated$.subscribe(
      item => {
        console.log('itemActivated subscription assigning item', item);
        this.item = item;
    });
    this.refresh();
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  refresh(): void {
    this.itemService.apps().subscribe(apps => {
      if (apps) {
        //console.log('apps:',apps);
        this.apps = apps;
        //console.log('apps items', this.apps);
      } else {
        this.apps = [];
      }
    });
    
    this.sessionService.refresh();
  }

  canAddItem(): boolean {
    return true;
  }

  importFile(event: any) {
    console.log(event.target.files[0]);
  }

  onAdd(event: any) {
    if (this.canAddItem()) {

      this.itemService.dialogs().subscribe(dialogs => {
        if (dialogs) {
          const dialog = dialogs[0];

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
    
  }

  onEdit(event: any) {

    this.itemService.dialogs().subscribe(dialogs => {
      if (dialogs) {
        const dialog = dialogs[0];

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
  
            this.itemService.update(result.id, result).subscribe(res => {
              this.refresh();
            });
          }
        });
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
    this.refresh();
  }

}
