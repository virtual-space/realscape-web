import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
// import {LngLat, Map, Marker, Point} from "mapbox-gl";
// @ts-ignore
//marko import * as MapboxDraw from 'mapbox-gl-draw'; 
import {MatDialog} from "@angular/material/dialog";
import { features } from 'process';
import { range } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LngLat, Map, NavigationControl, Marker } from 'mapbox-gl';
// @ts-ignore
import * as MapboxDraw from "mapbox-gl-draw";
import 'mapbox-gl-draw/dist/mapbox-gl-draw.css';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.sass']
})
export class LocationComponent implements OnInit {

  //location?: LngLat;
  public geojson: any;
  //map?: Map;
  public draw: any;
  private canvas: any;
  location: any;

  isLoaded = false;
  marker?: Marker;
  map?: Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 45.899977;
  lng = 6.172652;
  zoom = 15;
  token = environment.mapboxToken;

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
          //console.log(position);
          this.location = {
            coordinates: [position.coords.longitude, position.coords.latitude],
            type: "Point"
          }
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          this.loadMap();
        });
      }
    } else {
      this.location = this.data.location;
      if(this.location){
        if(this.location['type'] === 'Point'){
          this.lng = this.location['coordinates'][0];
          this.lat = this.location['coordinates'][1];
        } else if (this.location['type'] === 'Polygon') {
          let sumlat = 0
          let sumlong = 0
          let count = 0
          //finding the center of the polygon.
          this.location['coordinates'][0].forEach((coord:any) => {
                sumlat += coord[1]
                sumlong += coord[0]
                count += 1
          });
          this.lat = sumlat/count;
          this.lng = sumlong/count;
          console.log(this);
        } else {
          console.log("ERROR: Invalid type.")
        }
      }
      this.loadMap();
    }
  }

  onOkClick(): void {
    //console.log("Submit Location Data")
    if (this.marker) {
      const lngLat = this.marker.getLngLat();
      this.dialogRef.close({location: {type: 'Point', coordinates: [lngLat.lng, lngLat.lat]}});
    } else {
      let featureCollection = this.draw.getAll()
      if (featureCollection.features[0]){
        this.dialogRef.close({location: featureCollection.features[0].geometry});
      }
    }
  }

  onCancelClick(): void {
    console.log("Close Edit Dialog")
    this.dialogRef.close();
  }

  onClearClick(): void {//this should probably be removed since the delete button does the same thing.
    console.log("Clear Location Data")
    var featureCollection = this.draw.getAll()
    featureCollection.features = []
    this.draw.set(featureCollection)
  }

  onMapLoaded(e: {type: string, target: Map}) {
    console.log('map loaded', e);
    

    /*
    
    */
    this.isLoaded = true;
  }

  onDragEnd(event: any) {

    console.log(event)
    if (event) {
      var lngLat = event['target']['_lngLat']
      console.log(lngLat)
      this.lat = lngLat['lat'];
      this.lng = lngLat['lng'];
      if (this.map) {
        this.map.setCenter([this.lng, this.lat]);
      }
      
    }
  }

  loadMap(): void {
    if(!this.isLoaded){
      console.log('loading map...')
      this.map = new Map({
        accessToken: this.token,
        container: 'location-map',
        style: this.style,
        zoom: this.zoom,
        center: [this.lng, this.lat] 
      });
      this.map.addControl(new NavigationControl());
        this.draw = new MapboxDraw(
          {
            controls: 
            {
              //point: true,
              polygon: true,
              trash: true
            },
            displayControlsDefault: false,
            userProperties: true
          }
        );
        this.map.addControl(this.draw, 'top-right');
        this.map.on('load', this.onMapLoaded);
        this.map.on('draw.create', e => {
          console.log('draw.create',e)
          if (this.marker) {
            this.marker.remove();
            this.marker = undefined;
          }
        });
    
        this.map.on('draw.delete', e => {
          console.log('draw.delete',e)
          this.marker = new Marker({draggable: true})
            .setLngLat([this.lng, this.lat])
            .addTo(e.target);
            this.marker.on('dragend', this.onDragEnd);
        });
        
        this.sleep(500).then(() => {

          if(this.location && this.map){
            if(this.location['type'] === 'Point'){
              this.marker = new Marker({draggable: true})
              .setLngLat([this.location['coordinates'][0], this.location['coordinates'][1]])
              .addTo(this.map);
              this.marker.on('dragend', this.onDragEnd);
            } else if (this.location['type'] === 'Polygon') {
              let sumlat = 0
              let sumlong = 0
              let count = 0
              //finding the center of the polygon.
              this.location['coordinates'][0].forEach((coord:any) => {
                    sumlat += coord[1]
                    sumlong += coord[0]
                    count += 1
              });
              this.lat = sumlat/count;
              this.lng = sumlong/count;
              
              this.draw.set({
                type: 'FeatureCollection',
                features: [{
                  type: 'Feature',
                  properties: {},
                  id: 'initial64b3f1896dc2dc5eb642bfdb',
                  geometry: this.location
                }]
              });
      
            }
          }
        });
        
        
        
    } else {
      console.log('refreshing map')
    }
  }
  
  sleep (time: any): any {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

}
