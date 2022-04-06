import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Item, ItemService } from '../services/item.service';
import {Router} from '@angular/router';
import {CalendarEvent, CalendarEventAction, CalendarView} from 'angular-calendar';

@Component({
  selector: 'app-rn-calendar-view',
  templateUrl: './rn-calendar-view.component.html',
  styleUrls: ['./rn-calendar-view.component.sass']
})
export class RnCalendarViewComponent implements OnInit {

  @Input() items: Item[] = [];

  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();

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
        //this.onEditDialog(event['item']);
      },
    },
    {
      label: '<i class="material-icons">delete</i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        //this.onDeleteDialog(event['item']);
      },
    },
    {
      label: '<i class="material-icons">qr_code</i>',
      a11yLabel: 'QRCode',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        //this.onQRCode(event['item']);
      },
    },
  ];

  events: CalendarEvent[] = [];

  constructor(private itemService: ItemService, protected router: Router) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['items']) {
      //this.dataSource.data = this.items;
    }
  }

  onItemClick(item: any) {
    /*
    if (!this.isLink(item) && !this.isItemLink(item)) {
      //route to item
      this.router.navigate(['/items', item.id]);
    } else if (this.isLink(item) && !this.isItemLink(item)) {
      //route to item via link
      this.router.navigate(['/items', this.getLinkedItemId(item)]);
    } else if (this.isLink(item) && !this.isItemLink(item)) {
      //route to extenal link in a new window
      window.open(this.getLink(item), '_blank');
    }*/
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

  onCalendarClick(event: any) {
    /*
    if (this.onAdd) {
      const d = moment(event.date).utc().format();
      this.onAdd.emit({valid_from: d});
    }*/
  }

}
