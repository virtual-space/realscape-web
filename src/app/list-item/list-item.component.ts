import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {QRCodeComponent} from "angularx-qrcode";
import {MatDialog} from "@angular/material";
import {Item, ItemService} from "../services/item.service";
import {QrCodeViewComponent} from "../qr-code/qr-code.component";
import {EditItemComponent} from "../edit-item/edit-item.component";
import {DeleteItemComponent} from "../delete-item/delete-item.component";
import {ApplicationService} from "../services/application.service";

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent implements OnInit {

  @Input('item') item: Item;
  @Output() onRefresh: EventEmitter<any> = new EventEmitter();
  constructor(public dialog: MatDialog, private itemService: ItemService) { }

  ngOnInit() {
  }

  onQRCode() {
    const dialogRef = this.dialog.open(QrCodeViewComponent, {
      width: '400px',
      data: { code: 'https://www.realnet.io/items/' + this.item.id, name: this.item.name }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  editDialog(): void {
    const dialogRef = this.dialog.open(EditItemComponent, {
      width: '400px',
      data: {item: this.item}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.itemService.update(result.id, result).subscribe(res => {
        if (this.onRefresh) {
          this.onRefresh.emit();
        }
      });
    });
  }

  deleteDialog(): void {
    const dialogRef = this.dialog.open(DeleteItemComponent, {
      width: '400px',
      data: this.item
    });

    dialogRef.afterClosed().subscribe(result => {
      this.itemService.delete(result.id).subscribe(res => {
        if (this.onRefresh) {
          this.onRefresh.emit();
        }
      });
    });
  }

  trimItemName(itemName: String) {
    if (itemName && itemName.length > 17) {
      return itemName.substring(0, 14) + '...';
    }
    return itemName;
  }

  getLink(): string {
    return this.itemService.getLink(this.item);
  }

  getLinkedItemId(): string {
    return this.itemService.getLinkedItemId(this.item);
  }

  isLink(): boolean {
    return this.itemService.isLink(this.item);
  }

  isItemLink(): boolean {
    return this.itemService.isInternalLink(this.item);
  }
}
