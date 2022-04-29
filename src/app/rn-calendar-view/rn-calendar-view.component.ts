import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Item, ItemService } from '../services/item.service';
import {Router} from '@angular/router';
import { MatTableDataSource } from "@angular/material/table";
import {CalendarEvent, CalendarEventAction, CalendarView} from 'angular-calendar';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';

@Component({
  selector: 'app-rn-calendar-view',
  templateUrl: './rn-calendar-view.component.html',
  styleUrls: ['./rn-calendar-view.component.sass']
})
export class RnCalendarViewComponent implements OnInit {

  @Input() items: Item[] = [];
  dataSource = new MatTableDataSource<any>(this.items);
  Month = CalendarView.Month;
  Week = CalendarView.Week;
  Day = CalendarView.Day;
  view: CalendarView = this.Month;
  viewDate: Date = new Date();
  activeDayIsOpen: boolean = false;

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
    /*{
      label: '<i class="material-icons">edit</i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        //this.onEditDialog(event['item']);
      },
    },*//*
    {
      label: '<i class="material-icons">delete</i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        //this.onDeleteDialog(event['item']);
      },
    },*/
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
    console.log('init',this.items)
    this.dataSource.data = this.items;
    this.dataSource.data.forEach(value => {
      console.log(value)
      if(value.valid_from){
        this.events.push({
          start: startOfDay(new Date()),
          title: value.name,
          color: this.colors.yellow,
          actions: this.actions,
        })
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes',this.items)
    if(changes['items']) {
      this.dataSource.data = this.items;
      this.events = [];
      this.dataSource.data.forEach(value => {
        console.log(value)
        if(value.valid_from){
          console.log('has valid_from',value.valid_from)
          if(value.valid_to){
            console.log('has valid_to',value.valid_to)
            this.events.push({
              start: new Date(value.valid_from),
              end: new Date(value.valid_to),
              id: value.id,
              title: value.name,
              color: this.colors.yellow,
              actions: this.actions,
            })
          } else {
            this.events.push({
              start: new Date(value.valid_from),
              id: value.id,
              title: value.name,
              color: this.colors.yellow,
              actions: this.actions,
            })
          }
        } else {
          console.log(value.id, "does not have a valid start date")
        }
      })
    }
  }

  onItemClick(item: any) {
    console.log(item)
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

  setView(view: CalendarView) {
    this.view = view;
  }

  onCalendarClick(event: any) {
    console.log(event)
    if (isSameMonth(event.date, this.viewDate)) {
      if ((isSameDay(this.viewDate, event.date) && this.activeDayIsOpen) || event.events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = event.date;
    }
  }

}
