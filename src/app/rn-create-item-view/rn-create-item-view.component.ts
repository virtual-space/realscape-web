import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSelectChange } from '@angular/material/select';
import {ItemService, Item, Type, itemIsInstanceOf, isInstanceOf } from "../services/item.service";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {LocationComponent} from "../location/location.component";
import * as MapboxGl from 'mapbox-gl';

@Component({
  selector: 'app-rn-create-item-view',
  templateUrl: './rn-create-item-view.component.html',
  styleUrls: ['./rn-create-item-view.component.sass']
})
export class RnCreateItemViewComponent implements OnInit {

  @Input() item?: Item;
  name?: string;
  url?: Event;
  types: Type[] = [];
  public = false;
  parent_id? :string;
  shouldDisablePublic = false;

  fileToUpload?: File | null = null;

  selectedType = 'Video';
  selectedIcon = 'ondemand_video';

  //location?: mapboxgl.LngLat;
  valid_from = null;
  valid_to = null;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: string[] = [];

  constructor(private itemService: ItemService,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.itemService.types().subscribe(types => {
      this.types = types.filter(t => t.attributes && t.attributes['creatable'] === 'true');
      if (this.item && this.item.attributes && 'creatable_types' in this.item.attributes) {
          const includedTypeNames: Set<string> = new Set(this.item.attributes['creatable_types']);
          //console.log('************************* included type names ', includedTypeNames);
          //const includedTypes = new Set(types.filter(t => includedTypeNames.has(t.name)).map(t => t['id']));
          //this.types = this.types.filter(t => includedTypes.has(t['id']) || includedTypes.has(t['base_id']) );
          const includedTypes:Type[] = [];
          for (let type of this.types) {
            for(let type_name of includedTypeNames) {
              if (isInstanceOf(type, type_name)) {
                console.log('************************* found instance ', type.name, type_name);
                includedTypes.push(type);  
                break;
              }
            }
          } 
          this.types = includedTypes;
          console.log('************************* resulting types ', includedTypes);
      }
      
      if (this.types.length > 0) {
        const t = this.types[0]['name'];
        if (t) {
          this.selectedType = t;
        }
      }

      if (this.item) {
        this.parent_id = this.item.id;
        /*
        if (this.item.public !== undefined) {
          this.public = this.data.public;
          this.shouldDisablePublic = true;
        }
        if (this.data.location) {
          //this.location = new MapboxGl.LngLat(this.data.location[0], this.data.location[1]);
        }
        if (this.data.valid_from) {
          this.valid_from = this.data.valid_from;
        }*/
      }
      console.log(this);
    });
  }

  onNoClick(): void {
    //this.dialogRef.close();
  }

  onTypeChange(event: MatSelectChange) {
    const e = this.types.filter(t => t.name === event.value)[0];
    if (e && e.icon) {
      this.selectedIcon = e.icon;
    }
  }

  handleFileInput(event: Event) {
    if (!(event.target instanceof HTMLInputElement)) return;

    if(event.target.files) {
      this.fileToUpload = event.target.files.item(0);
      if (this.fileToUpload) {
        this.name = this.fileToUpload.name;
      }
    }
  }

  onOkClick(): void {
    const d: any = { type: this.selectedType, name: this.name, url: this.url, public: this.public, valid_from: this.valid_from, valid_to: this.valid_to };
    console.log(this);
    /*if (this.location){
      d.location = this.location;
    }*/
    if (this.parent_id) {
      d.parent_id = this.parent_id;
    }
    d.file = this.fileToUpload;
    console.log(d);
    //this.dialogRef.close(d);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.tags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }


  onLocation() {
    const dialogRef = this.dialog.open(LocationComponent, {
      width: '400px',
      height: '600px',
      //data: { location: this.location }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //this.location = result['location'];
      }
    });
  }

  onSchedule() {
    /*
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
    */
  }

}
