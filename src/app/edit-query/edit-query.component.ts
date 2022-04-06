import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, Inject} from '@angular/core';
import {MatChipInputEvent} from "@angular/material/chips";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {ItemService, Query, Type} from "../services/item.service";
import {FormControl, FormGroup} from "@angular/forms";
import {LocationComponent} from "../location/location.component";
//import {LngLat} from "mapbox-gl";
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatAutocomplete, MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-edit-query',
  templateUrl: './edit-query.component.html',
  styleUrls: ['./edit-query.component.sass']
})
export class EditQueryComponent implements OnInit {

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  allTypes: Type[] = [];
  tags = [];
  //location?: LngLat;
  locationMode = 'any';
  loggedIn = false;

  filteredTypes: Observable<string[]>;
  @Input() query: Query = new Query();
  @Output() onSave: EventEmitter<Query> = new EventEmitter<Query>();
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  @Output() onRun: EventEmitter<Query> = new EventEmitter<Query>();

  // @ViewChild('fruitInput', {static: true}) fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: true}) matAutocomplete?: MatAutocomplete;

  typesControl = new FormControl();

  queryForm = new FormGroup({
    types: this.typesControl,
    tags: new FormControl(),
    name: new FormControl(),
    public: new FormControl(),
    myItems: new FormControl(),
    parentId: new FormControl(),
    lat: new FormControl({value: '', disabled: true}),
    lng: new FormControl({value: '', disabled: true}),
    radius: new FormControl(100)
  });

  constructor(private itemService: ItemService,
              private authService: AuthService,
              public dialogRef: MatDialogRef<EditQueryComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public dialog: MatDialog) {
    this.filteredTypes = this.typesControl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.allTypes.map(t => t.name!).slice()));
  }

  ngOnInit() {
    if (!this.query) {
      this.query = new Query();
    }

    this.loggedIn = this.authService.isLoggedIn();

    this.itemService.types().subscribe(types => {
      this.allTypes = types;
      this.filteredTypes = this.typesControl.valueChanges.pipe(
        startWith(null),
        map((fruit: string | null) => fruit ? this._filter(fruit) : this.allTypes.map(t => t.name!).slice()));
      this.queryForm.patchValue(this.query);
      if (this.query.lat && this.query.lng) {
        this.locationMode = 'custom';
        this.queryForm.patchValue({lat: this.query.lat});
        this.queryForm.patchValue({lng: this.query.lng});
        //this.location = new LngLat(this.query.lng, this.query.lat);
      } else {
        this.locationMode = 'any';
      }
      console.log(this.query);
    });
  }

  addType(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if (!this.query.types) {
      this.query.types = [];
    }
    if ((value || '').trim()) {
      this.query.types.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeType(fruit: string): void {
    if (this.query && this.query.types) {
      const index = this.query.types.indexOf(fruit);

      if (index >= 0) {
        this.query.types.splice(index, 1);
      }
      if (this.query.types && this.query.types.length === 0) {
        this.query.types = undefined;
      }
    }
    
  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if (!this.query.tags) {
      this.query.tags = [];
    }
    if ((value || '').trim()) {
      this.query.tags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeTag(fruit: string): void {
    if (this.query && this.query.tags) {
      const index = this.query.tags.indexOf(fruit);

      if (index >= 0 && this.query && this.query.tags) {
        this.query.tags.splice(index, 1);
      }
      if (this.query && this.query.tags && this.query.tags.length === 0) {
        this.query.tags = undefined;
      }
    }
  }

  onLocationModeChanged(event: any) {
    console.log(event);
  }

  onLocation() {
    /*
    if (this.location === null) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          console.log(position);
          const dialogRef = this.dialog.open(LocationComponent, {
            width: '320px',
            height: '600px',
            data: { location: [position.coords.longitude, position.coords.latitude] }
          });

          dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result) {
              //this.location = new LngLat(result.location.lng, result.location.lat);
              this.queryForm.patchValue({lat: result.location.lat});
              this.queryForm.patchValue({lng: result.location.lng});
            }
          });
        });
      }
    } else if (this.location) {
      const pos = this.location.toArray();
      const dialogRef = this.dialog.open(LocationComponent, {
        width: '320px',
        height: '600px',
        data: { location: [pos[0], pos[1]] }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          //this.location = new LngLat(result.location.lng, result.location.lat);
          this.queryForm.patchValue({lat: result.location.lat});
          this.queryForm.patchValue({lng: result.location.lng});
        }
      });
    } */
  }

  onSaveClicked() {
    const result = Object.assign({}, this.queryForm.value);
    result.tags = this.query.tags || null;
    result.types = this.query.types || null;
    /*
    if (this.location) {
      const pos = this.location.toArray();
      result.lat = pos[1];
      result.lng = pos[0];
    } else {
      delete result.radius;
    }
    */
    this.query = result;
    //console.log(this.query);
    if (this.onSave) {
      this.onSave.emit(this.query);
    }
  }

  onCloseClicked() {
    if (this.onClose) {
      this.onClose.emit(this.query);
    }
  }

  onRunClicked() {
    const result = Object.assign({}, this.queryForm.value);
    result.tags = this.query.tags || null;
    result.types = this.query.types || null;
    /*
    if (this.location) {
      const pos = this.location.toArray();
      result.lat = pos[1];
      result.lng = pos[0];
    }
    */
    this.query = result;
    //console.log(this.query);
    if (this.onRun) {
      this.onRun.emit(this.query);
    }
  }

  onAny() {
    //console.log('on-any');
  }

  onCurrent() {
    console.log('on-current');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (position) {
          //console.log(position);
          //this.location = new LngLat(position.coords.longitude, position.coords.latitude);
          this.queryForm.patchValue({lat: position.coords.latitude});
          this.queryForm.patchValue({lng: position.coords.longitude});
        }
      });
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.query.types) {
      this.query.types = [];
    }
    this.query.types.push(event.option.viewValue);
    //this.fruitInput.nativeElement.value = '';
    if (this.queryForm) {
      const ts = this.queryForm.get('types');
      if (ts) {
        ts.setValue(null);
      }
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value;
    return this.allTypes.filter(fruit => fruit && fruit.name && fruit.name.indexOf(filterValue) === 0).map(f => f.name!);
  }

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }

  onSave1(result: any) {
    result.save = true;
    this.dialogRef.close(result);
  }

  onClose1() {
    this.dialogRef.close();
  }

  onRun1(result: any) {
    result.run = true;
    this.dialogRef.close(result);
  }

}
