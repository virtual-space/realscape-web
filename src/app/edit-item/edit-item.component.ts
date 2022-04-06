import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Item, ItemService} from "../services/item.service";
import {LocationComponent} from "../location/location.component";
import {LngLat} from "mapbox-gl";
import {MatChipInputEvent} from "@angular/material/chips";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {ScheduleItemComponent} from "../schedule-item/schedule-item.component";

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.sass']
})
export class EditItemComponent implements OnInit {
  item?: Item;
  /*
  name = null;
  description = null;
  link = null;
  public = null;
  tags = [];*/
  location?: any;
  status?: any;
  statuses = [{name: 'To do', status: 'new'}, {name: 'In progress', status: 'working'}, {name: 'Done', status: 'done'}];
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(public dialogRef: MatDialogRef<EditItemComponent>,
              private itemService: ItemService,
              public dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.item = this.data.item || null;
    if (this.item) {
      this.location = this.item.location
      //this.status = this.item.status;
    }
    console.log('item',this.item);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onOkClick(): void {
    console.log("Submit Data")
    let data: {[index: string]:any} = {};

    if (this.item && this.item.attributes) {
      data['location'] = this.location;
      data['status'] = this.status;
      data['name'] = this.item.name;
      data['tags'] = this.item.tags;
      data['valid_from'] = this.item.attributes['valid_from'];
      data['valid_to'] = this.item.attributes['valid_to'];
    }
    this.dialogRef.close(data);
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
    let data: {[index: string]:any} = {};

    if (this.item && this.item.attributes) {
        data['valid_from'] = this.item.attributes['valid_from'];
        data['valid_to'] = this.item.attributes['valid_to'];
    }

    const dialogRef = this.dialog.open(ScheduleItemComponent, {
      width: '400px',
      height: '600px',
      data: data
    });

    dialogRef.afterClosed().subscribe((result: {[index: string]:any}) => {
      if (result && this.item) {
        if (this.item.attributes) {
          this.item.attributes['valid_from'] = result['valid_from'];
          this.item.attributes['valid_to'] = result['valid_to'];
        }
      }
    });
  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if (this.item) {
      if (!this.item.tags) {
        this.item.tags = [];
      }
      if ((value || '').trim()) {
        this.item.tags.push(value.trim());
      }
    }
    

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeTag(fruit: string): void {
    if (this.item && this.item.tags) {
      const index = this.item.tags.indexOf(fruit);

      if (index >= 0) {
        if (this.item && this.item.tags) {
          this.item.tags.splice(index, 1);
        }
      }
      if (this.item.tags && this.item.tags.length === 0) {
        this.item.tags = undefined;
      }
    }
  }

}
