import { Component, Input, Output, OnInit, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Item, ItemService } from '../services/item.service';
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-rn-list-view',
  templateUrl: './rn-list-view.component.html',
  styleUrls: ['./rn-list-view.component.sass']
})
export class RnListViewComponent implements OnInit, OnChanges {

  @Input() items: Item[] = []
  dataSource = new MatTableDataSource<any>(this.items);
  displayedColumns: string[] = ['icon', 'name', 'tags', 'menu'];
  @Output() onRefresh: EventEmitter<any> = new EventEmitter();

  constructor(private itemService: ItemService, 
              public dialog: MatDialog) { }

  ngOnInit() {
    console.log(this.items);
    this.dataSource.data = this.items;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['items']) {
      this.dataSource.data = this.items;
    }
  }

  refresh() {
    if (this.onRefresh) {
      this.onRefresh.emit();
    }
  }

  onQRCode(item: Item) {
    /*
    const dialogRef = this.dialog.open(QrCodeViewComponent, {
      width: '400px',
      data: { code: 'https://www.realnet.io/items/' + item.id, name: item.name }
    });

    dialogRef.afterClosed().subscribe(result => {
    });*/
  }

  onEditDialog(item: Item): void {
    /*
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
    */
  }

  onDeleteDialog(item: Item): void {/*
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
    });*/
  }
  
  getLink(item: Item): string {
    return this.itemService.getLink(item);
  }

  getLinkedItemId(item: Item): string {
    return this.itemService.getLinkedItemId(item);
  }

  isLink(item: Item): boolean {
    return this.itemService.isLink(item);
  }

  isItemLink(item: Item): boolean {
    return this.itemService.isInternalLink(item);
  }

}
