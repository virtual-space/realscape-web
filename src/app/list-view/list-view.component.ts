import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ItemService} from "../services/item.service";
import {MatTableDataSource} from "@angular/material/table";
import {QrCodeViewComponent} from "../qr-code/qr-code.component";
import {EditItemComponent} from "../edit-item/edit-item.component";
import {DeleteItemComponent} from "../delete-item/delete-item.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent implements OnInit {

  @Input() items = [];
  dataSource = new MatTableDataSource<any>(this.items);
  displayedColumns: string[] = ['icon', 'name', 'tags', 'menu'];
  @Output() onRefresh: EventEmitter<any> = new EventEmitter();

  constructor(private itemService: ItemService, public dialog: MatDialog) { }

  ngOnInit() {
    this.dataSource.data = this.items;
  }

  refresh() {
    if (this.onRefresh) {
      this.onRefresh.emit();
    }
  }

  onQRCode(item) {
    const dialogRef = this.dialog.open(QrCodeViewComponent, {
      width: '400px',
      data: { code: 'https://www.realnet.io/items/' + item.id, name: item.name }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  onEditDialog(item): void {
    const dialogRef = this.dialog.open(EditItemComponent, {
      width: '400px',
      data: {item: item}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.itemService.update(result.id, result).subscribe(res => {
        if (this.onRefresh) {
          this.onRefresh.emit();
        }
      });
    });
  }

  onDeleteDialog(item): void {
    const dialogRef = this.dialog.open(DeleteItemComponent, {
      width: '400px',
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      this.itemService.delete(result.id).subscribe(res => {
        if (this.onRefresh) {
          this.onRefresh.emit();
        }
      });
    });
  }

  getLink(item): string {
    return this.itemService.getLink(item);
  }

  getLinkedItemId(item): string {
    return this.itemService.getLinkedItemId(item);
  }

  isLink(item): boolean {
    return this.itemService.isLink(item);
  }

  isItemLink(item): boolean {
    return this.itemService.isInternalLink(item);
  }
}
