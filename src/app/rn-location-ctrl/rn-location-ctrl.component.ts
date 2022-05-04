import { Component, OnInit } from '@angular/core';
import { LocationComponent } from '../location/location.component';
import { RnCtrlComponent } from '../rn-ctrl/rn-ctrl.component';

@Component({
  selector: 'app-rn-location-ctrl',
  templateUrl: './rn-location-ctrl.component.html',
  styleUrls: ['./rn-location-ctrl.component.sass']
})
export class RnLocationCtrlComponent extends RnCtrlComponent implements OnInit {

  onClick() {
    const dialogRef = this.dialog.open(LocationComponent, {
      width: '400px',
      data: { location: this.item? this.item.location : undefined}
    });

    console.log(this.item);

    dialogRef.afterClosed().subscribe(result => {
      this.formControl.setValue(JSON.stringify(result.location));
    });
  }

  override getValue() {
    if (this.item && this.item.location) {
      return JSON.stringify(this.item.location);
    } else {
      return undefined;
    }
  }

}
