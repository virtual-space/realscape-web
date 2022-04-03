import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatChipInputEvent, MatDialog, MatDialogRef} from "@angular/material";
import {ItemService} from "../services/item.service";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {LocationComponent} from "../location/location.component";
import {LngLat} from "mapbox-gl";
import {ApplicationService} from "../services/application.service";
import {ScheduleItemComponent} from "../schedule-item/schedule-item.component";

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.scss']
})
export class CreateItemComponent implements OnInit {

  name = null;
  url = null;
  types = [];
  public = false;
  parent_id = null;
  shouldDisablePublic = false;

  fileToUpload: File = null;

  selectedType = 'Video';
  selectedIcon = 'ondemand_video';

  location = null;
  valid_from = null;
  valid_to = null;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags = [];

  constructor(public dialogRef: MatDialogRef<CreateItemComponent>,
              private itemService: ItemService,
              private appService: ApplicationService,
              public dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.itemService.types().subscribe(types => {
      if (this.data.item && this.data.item.attributes && 'creatable_types' in this.data.item.attributes) {
          const includedTypeNames = new Set(this.data.item.attributes['creatable_types']);
          const includedTypes = new Set(types.filter(t => includedTypeNames.has(t.name)).map(t => t['id']));
          this.types = types.filter(t => includedTypes.has(t['id']) || includedTypes.has(t['base_id']) );
      }
      this.types = this.types.filter(t => t.attributes['creatable'] === 'true');
      if (this.types.length > 0) {
         this.selectedType = this.types[0]['name'];
      }

      if (this.data) {
        if (this.data.parent_id) {
          this.parent_id = this.data.parent_id;
        }
        if (this.data.public !== undefined) {
          this.public = this.data.public;
          this.shouldDisablePublic = true;
        }
        if (this.data.location) {
          this.location = new LngLat(this.data.location[0], this.data.location[1]);
        }
        if (this.data.valid_from) {
          this.valid_from = this.data.valid_from;
        }
      }
      console.log(this);
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onTypeChange(event) {
    const e = this.types.filter(t => t.name === event.value)[0];
    if (e) {
      this.selectedIcon = e.icon;
    }
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    if (this.fileToUpload) {
      this.name = this.fileToUpload.name;
    }
  }

  onOkClick(): void {
    const d: any = { type: this.selectedType, name: this.name, url: this.url, public: this.public, valid_from: this.valid_from, valid_to: this.valid_to };
    console.log(this);
    if (this.location){
      d.location = this.location;
    }
    if (this.parent_id) {
      d.parent_id = this.parent_id;
    }
    d.file = this.fileToUpload;
    console.log(d);
    this.dialogRef.close(d);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.tags.push({name: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(tag: any): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }


  onLocation() {
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
      data: { valid_from: this.valid_from, valid_to: this.valid_to }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.valid_from = result['valid_from'];
        this.valid_to = result['valid_to'];
      }
    });
  }
}
