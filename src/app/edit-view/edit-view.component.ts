import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-edit-view',
  templateUrl: './edit-view.component.html',
  styleUrls: ['./edit-view.component.scss']
})
export class EditViewComponent implements OnInit {

  types = [ {name: 'List', type: 'List', icon: 'view_list'},
            {name: 'Cards', type: 'Cards', icon: 'view_module'},
            {name: 'Map', type: 'Map', icon: 'map'},
            {name: 'Calendar', type: 'Calendar', icon: 'calendar_today'},
            {name: 'Board', type: 'Board', icon: 'assignment'},
            {name: 'Panel', type: 'Panel', icon: 'dashboard'},
            {name: 'Scene', type: 'Scene', icon: 'nature_people'},
            {name: 'Content', type: 'Content', icon: 'preview'},
            {name: 'Properties', type: 'Properties', icon: 'ballot'},];

  selectedTypeName = this.types[0].name;
  selectedType = this.types[0];
  name = 'View';

  constructor(public dialogRef: MatDialogRef<EditViewComponent>,
              public dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    if (this.data) {
      this.name = this.data.name;
      this.selectedTypeName = this.data.type;
      this.selectedType = this.data;
    }
  }

  onTypeChange(event) {
    console.log(event);
    const e = this.types.filter(t => t.name === event.value)[0];
    console.log(e);
    if (e) {
      this.selectedType = e;
    }
  }

  onOkClick(): void {
    this.dialogRef.close({name: this.name, type: this.selectedType.type , icon: this.selectedType.icon});
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
