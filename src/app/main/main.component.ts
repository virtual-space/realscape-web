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
import { RnMsgBoxComponent } from '../rn-msg-box/rn-msg-box.component';
import { request } from 'http';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent {
  item?: Item;
  apps: Item[] = [];
  subscription?: Subscription;

  uploadProgress = 0;
  uploadingFile = false;
  uploading = false;

  constructor() { }


}
