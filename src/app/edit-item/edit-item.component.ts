import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {Item, ItemService} from "../services/item.service";
import {ApplicationService} from "../services/application.service";
import {LocationComponent} from "../location/location.component";
import {LngLat} from "mapbox-gl";
import {MatChipInputEvent} from "@angular/material/chips";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {ScheduleItemComponent} from "../schedule-item/schedule-item.component";

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent implements OnInit {
  item: Item = null;
  /*
  name = null;
  description = null;
  link = null;
  public = null;
  tags = [];*/
  location = null;
  status = null;
  statuses = [{name: 'To do', status: 'new'}, {name: 'In progress', status: 'working'}, {name: 'Done', status: 'done'}];
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(public dialogRef: MatDialogRef<EditItemComponent>,
              private itemService: ItemService,
              private appService: ApplicationService,
              public dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.item = this.data.item || null;
    if (this.item) {
      if (this.item['location']){
        this.location = this.item['location']
      }
      this.status = this.item.status;
    }
    console.log('item',this.item);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onOkClick(): void {
    console.log("Submit Data")
    this.dialogRef.close({id: this.item.id,
      description: this.item.description,
      location: this.location,
      status: this.status,
      valid_from: this.item['valid_from'],
      valid_to: this.item['valid_to'],
      name: this.item.name,
      link: this.item.link,
      public: this.item.public,
      tags: this.item.tags });
  }

  onLocation() {
    console.log('location',this.location)
    const dialogRef = this.dialog.open(LocationComponent, {
      width: '400px',
      height: '600px',
      data: { location: this.location }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.location = result['location'];
      }
    });
  }

  onSchedule() {
    const dialogRef = this.dialog.open(ScheduleItemComponent, {
      width: '400px',
      height: '600px',
      data: { valid_from: this.item['valid_from'], valid_to: this.item['valid_to'] }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.item['valid_from'] = result['valid_from'];
        this.item['valid_to'] = result['valid_to'];
      }
    });
  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if (!this.item.tags) {
      this.item.tags = [];
    }
    if ((value || '').trim()) {
      this.item.tags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeTag(fruit): void {
    const index = this.item.tags.indexOf(fruit);

    if (index >= 0) {
      this.item.tags.splice(index, 1);
    }
    if (this.item.tags && this.item.tags.length === 0) {
      this.item.tags = null;
    }
  }

}
