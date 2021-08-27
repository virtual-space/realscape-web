import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CalendarEvent, CalendarEventAction, CalendarView} from "angular-calendar";
import * as moment from 'moment';
import {QrCodeViewComponent} from "../qr-code/qr-code.component";
import {EditItemComponent} from "../edit-item/edit-item.component";
import {DeleteItemComponent} from "../delete-item/delete-item.component";
import {ItemService} from "../services/item.service";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss']
})
export class CalendarViewComponent implements OnInit {

  @Output() onRefresh: EventEmitter<any> = new EventEmitter();
  @Output() onAdd: EventEmitter<any> = new EventEmitter();

  view: CalendarView = CalendarView.Month;
  viewDate = new Date();

  colors: any = {
    red: {
      primary: '#ad2121',
      secondary: '#FAE3E3',
    },
    blue: {
      primary: '#1e90ff',
      secondary: '#D1E8FF',
    },
    yellow: {
      primary: '#e3bc08',
      secondary: '#FDF1BA',
    },
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="material-icons">edit</i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.onEditDialog(event['item']);
      },
    },
    {
      label: '<i class="material-icons">delete</i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.onDeleteDialog(event['item']);
      },
    },
    {
      label: '<i class="material-icons">qr_code</i>',
      a11yLabel: 'QRCode',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.onQRCode(event['item']);
      },
    },
  ];

  events: CalendarEvent[] = [];
  /*
  events: CalendarEvent[] = [
    {
      title: 'An event',
      start: new Date(),
      color: this.colors.red,
    },
  ];
  */
  constructor(private itemService: ItemService, public dialog: MatDialog, protected router: Router) { }

  ngOnInit() {
  }

  getEvent(item): CalendarEvent {
    const result = { title: item.name, item: item, color: this.colors.red, actions: this.actions, start: null };
    if (item['valid_from']) {
      result['start'] = moment(item['valid_from']).local().toDate();
    }
    if (item['valid_to']) {
      result['end'] = moment(item['valid_to']).local().toDate();
    }
    return result;
  }

  @Input('items')
  set items(val) {
    this.events = val.filter(i => i.valid_from || i.valid_to).map(i => this.getEvent(i));
    //console.log(val);
    //console.log(val.filter(i => i.valid_from || i.valid_to));
    //console.log(this.events);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    //this.modalData = { event, action };
    //this.modal.open(this.modalContent, { size: 'lg' });
    console.log(event);
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

  onItemClick(item) {
    if (!this.isLink(item) && !this.isItemLink(item)) {
      //route to item
      this.router.navigate(['/items', item.id]);
    } else if (this.isLink(item) && !this.isItemLink(item)) {
      //route to item via link
      this.router.navigate(['/items', this.getLinkedItemId(item)]);
    } else if (this.isLink(item) && !this.isItemLink(item)) {
      //route to extenal link in a new window
      window.open(this.getLink(item), '_blank');
    }
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

  onCalendarClick(event) {
    if (this.onAdd) {
      const d = moment(event.date).utc().format();
      this.onAdd.emit({valid_from: d});
    }
  }
}
