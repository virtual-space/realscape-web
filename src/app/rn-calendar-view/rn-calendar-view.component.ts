import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Item, ItemService } from '../services/item.service';
import { Router } from '@angular/router';
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
import { RnViewComponent } from '../rn-view/rn-view.component';

@Component({
  selector: 'app-rn-calendar-view',
  templateUrl: './rn-calendar-view.component.html',
  styleUrls: ['./rn-calendar-view.component.sass']
})
export class RnCalendarViewComponent extends RnViewComponent implements OnInit {

  dataSource = new MatTableDataSource<any>(this.items);
  Month = CalendarView.Month;
  Week = CalendarView.Week;
  Day = CalendarView.Day;
  calendarView: CalendarView = this.Month;
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
    {
      label: '<i class="material-icons">edit</i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.openEditDialog(event.meta!);
      }
    },
    {
      label: '<i class="material-icons">delete</i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.openDeleteDialog(event.meta!);
      }
    },
    {
      label: '<i class="material-icons">qr_code</i>',
      a11yLabel: 'QRCode',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.openQRCodeDialog(event.meta!);
      }
    }
  ];

  calendarEvents: CalendarEvent<Item>[] = [];

  override ngOnInit(): void {
    ////console.log('init',this.items)
    this.populateItems();
  }

  getItemValidFrom(item: Item): any {
    if (item.valid_from) {
      return item.valid_from;
    } else if(item.linked_item) {
      return this.getItemValidFrom(item.linked_item);
    } else {
      return undefined;
    }
  }

  getItemValidTo(item: Item): any {
    if (item.valid_to) {
      return item.valid_to;
    } else if(item.linked_item) {
      return this.getItemValidTo(item.linked_item);
    } else {
      return undefined;
    }
  }

  populateItems() {
    this.dataSource.data = this.items;
    //this.dataSource.data.push(this.item)
    this.calendarEvents = [];

    if (this.view) {
      //console.log(this.view);
      if(this.view.attributes) {
        if ('view' in this.view.attributes) {
          const viewType = this.view.attributes['view'];
          if (viewType === 'month') {
            this.calendarView = this.Month;
          } else if (viewType === 'week') {
            this.calendarView = this.Week;
          } else if (viewType === 'day') {
            this.calendarView = this.Day;
          }
        }
      }
    }
    if(this.item) {
      if(this.item.valid_from){
        //////console.log('has valid_from',value.valid_from)
        if(this.item.valid_to){
          //////console.log('has valid_to',value.valid_to)
          this.calendarEvents.push({
            start: new Date(this.utcToLocal(this.item.valid_from)),
            end: new Date(this.utcToLocal(this.item.valid_to)),
            id: this.item.id,
            title: this.item.name!,
            color: this.colors.yellow,
            actions: this.actions,
            meta: this.item
          })
        } else {
          this.calendarEvents.push({
            start: new Date(this.utcToLocal(this.item.valid_from)),
            id: this.item.id,
            title: this.item.name!,
            color: this.colors.yellow,
            actions: this.actions,
            meta: this.item
          })
        }
      }
    }

    this.dataSource.data.forEach(value => {
      const valid_from = this.getItemValidFrom(value);
      const valid_to = this.getItemValidTo(value);
      //////console.log(value)
      if(valid_from){
        //////console.log('has valid_from',value.valid_from)
        if(valid_to){
          //////console.log('has valid_to',value.valid_to)
          this.calendarEvents.push({
            start: new Date(this.utcToLocal(valid_from)),
            end: new Date(this.utcToLocal(valid_to)),
            id: value.id,
            title: value.name,
            color: this.colors.yellow,
            actions: this.actions,
            meta: value
          })
        } else {
          this.calendarEvents.push({
            start: new Date(this.utcToLocal(valid_from)),
            id: value.id,
            title: value.name,
            color: this.colors.yellow,
            actions: this.actions,
            meta: value
          })
        }
      } else {
        //////console.log(value.id, "does not have a valid start date")
      }
    })
  }

  override ngOnChanges(changes: SimpleChanges): void {
    //////console.log('changes',this.items)
    if(changes['items'] || changes['item']) {
      this.populateItems();
    }
  }

  onItemClick(item: any) {
    //////console.log(item);
    this.onDisplay(item.meta);
  }

  setView(view: CalendarView) {
    ////console.log(view);
    this.calendarView = view;
  }

  onCalendarClick(event: any) {
    //console.log("calendarclick",event.date.toISOString());
    if (this.canAddItem()) {
      let item: Item = this.item? { ... this.item} : new Item();
      item.valid_from = this.localToUTC(event.date);
      item.valid_to = this.localToUTC(event.date);
      ////console.log(item);
      this.onAdd(item);
    }
    /*
    if (isSameMonth(event.date, this.viewDate)) {
      if (event.events && event.events.length) {
        if ((isSameDay(this.viewDate, event.date) && this.activeDayIsOpen) || event.events.length === 0) {
          this.activeDayIsOpen = false;
        } else {
          this.activeDayIsOpen = true;
        }
        this.viewDate = event.date;
      }
    }*/
  }

}
