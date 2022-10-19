import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Item, ItemService } from '../services/item.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from "@angular/material/table";
import {CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView} from 'angular-calendar';
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
          //console.log('event meta valid from', event.meta.valid_from)
          event.meta.valid_from = this.utcToLocal(event.meta.valid_from)
          event.meta.valid_to = this.utcToLocal(event.meta.valid_to)
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
    //////console.log'init',this.items)
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
      ////console.log(this.view);
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
        //console.log('has valid_from',this.item.valid_from)
        if(this.item.valid_to){
          ////////console.log'has valid_to',value.valid_to)
          this.calendarEvents.push({
            start: this.utcToLocal(this.item.valid_from),
            end: this.utcToLocal(this.item.valid_to),
            id: this.item.id,
            title: this.item.name!,
            color: this.colors.yellow,
            actions: this.actions,
            meta: this.item,
            resizable: {
              beforeStart: true, // this allows you to configure the sides the event is resizable from
              afterEnd: true
            },
            draggable: true
          })
        } else {
          this.calendarEvents.push({
            start: this.utcToLocal(this.item.valid_from),
            id: this.item.id,
            title: this.item.name!,
            color: this.colors.yellow,
            actions: this.actions,
            meta: this.item,
            resizable: {
              beforeStart: true, // this allows you to configure the sides the event is resizable from
              afterEnd: true
            },
            draggable: true
          })
        }
      }
    }

    this.dataSource.data.forEach(value => {
      const valid_from = this.getItemValidFrom(value);
      const valid_to = this.getItemValidTo(value);
      //console.logvalue)
      if(valid_from){
        console.log('has valid_from',this.utcToLocal(valid_from))
        if(valid_to){
          ////////console.log'has valid_to',value.valid_to)
          this.calendarEvents.push({
            start: this.utcToLocal(valid_from),
            end: this.utcToLocal(valid_to),
            id: value.id,
            title: value.name,
            color: this.colors.yellow,
            actions: this.actions,
            meta: value,
            resizable: {
              beforeStart: true, // this allows you to configure the sides the event is resizable from
              afterEnd: true
            },
            draggable: true
          })
        } else {
          this.calendarEvents.push({
            start: this.utcToLocal(valid_from),
            id: value.id,
            title: value.name,
            color: this.colors.yellow,
            actions: this.actions,
            meta: value,
            resizable: {
              beforeStart: true, // this allows you to configure the sides the event is resizable from
              afterEnd: true
            },
            draggable: true
          })
        }
      } else {
        ////////console.logvalue.id, "does not have a valid start date")
      }
    })
  }

  override ngOnChanges(changes: SimpleChanges): void {
    ////////console.log'changes',this.items)
    if(changes['items'] || changes['item']) {
      this.populateItems();
    }
  }

  onItemClick(item: any) {
    //console.log('item click',item);
    this.onDisplay(item.meta);
  }

  setView(view: CalendarView) {
    //////console.logview);
    this.calendarView = view;
  }

  onCalendarClick(event: any) {
    //console.logevent);
    //console.log"calendarclick",event.date.toISOString());
    if (this.canAddItem()) {
      let item: Item = this.item? { ... this.item} : new Item();
      item.valid_from = event.date;
      //console.log('calendar click item valid from', item.valid_from)
      item.valid_to = event.date;
      //////console.logitem);
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

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    console.log(event);
    this.itemService.update(event.meta.id, {
      valid_from: newStart, 
      valid_to: newEnd
    }).subscribe(item => {
      console.log('updated item', item);
      
      //event.start = newStart;
      //event.end = newEnd;
      
      const it = this.items.find(i => i.id === event.meta.id);
      console.log(it);
      if (it) {
        it.valid_from = item.valid_from;
        it.valid_to = item.valid_to;
      }
      console.log(it);
      this.populateItems();
    });
    //event.start = newStart;
    //event.end = newEnd;
    
  }

}
