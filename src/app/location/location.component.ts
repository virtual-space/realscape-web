import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {LngLat, Map, Marker} from "mapbox-gl";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {

  location = null;
  mapCenter = null;
  map: Map = null;

  @ViewChild("marker", {static: false}) marker;

  constructor(public dialogRef: MatDialogRef<LocationComponent>,
              public dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    console.log(this);
    if (this.data.location == null) {
      if (navigator.geolocation) {
        console.log("getting the current location");
        navigator.geolocation.getCurrentPosition((position) => {
          console.log(position);
          this.location = new LngLat(position.coords.longitude, position.coords.latitude);
          this.mapCenter = this.location;
          console.log(this);
        });
      }
    } else {
      this.location = this.data.location;
      this.mapCenter = this.location;
    }
  }

  onOkClick(): void {
    let loc = this.mapCenter;
    if (this.marker) {
      loc = this.marker.getLngLat();
    }
    this.dialogRef.close({location: loc});
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onClearClick(): void {

  }

  onDragEnd(event): void {
    this.mapCenter = event.target.getLngLat();
  }

  onLoad(event): void {
    console.log("map load", event);
    this.map = event;
    this.marker = new Marker({
      draggable: true
    }).setLngLat(this.location)
      .on('dragend', this.onDragEnd)
      .addTo(this.map);
  }

  onZoomEnd(event) {

    //console.log(this.marker);
    const center = this.map.getCenter();
    if (!this.marker) {
      this.marker = new Marker({
        draggable: true
      }).setLngLat([center.lng, center.lat])
        .on('dragend', this.onDragEnd)
        .addTo(this.map);
    } else {
      this.marker.setLngLat([center.lng, center.lat]);
    }
    /*
    const markerLngLat = this.marker.getLngLat();
    const center = this.map.getCenter();
    const dLng = Math.abs(markerLngLat[0] - center.lng);
    const dLat = Math.abs(markerLngLat[1] - center.lat);

    if (dLng > 0.005 || dLat > 0.005) {
      this.marker.setLngLat(center);
    }*/
  }

}
