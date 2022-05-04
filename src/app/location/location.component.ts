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
  mapCenter = null;
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
    //console.log(this);
    if (this.data.location == null) {
      if (navigator.geolocation) {
        console.log("getting the current location");
        navigator.geolocation.getCurrentPosition((position) => {
          //console.log(position);
          this.location = {
            coordinates: [position.coords.longitude, position.coords.latitude],
            type: "Point"
          }
          this.mapCenter = this.location['coordinates'];
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          this.loadMap();
          console.log('loading with user location',this);
        });
      }
    } else {
      this.location = this.data.location;
      if(this.location){
        if(this.location['type'] === 'Point'){
          this.mapCenter = this.location['coordinates'];
        } else if (this.location['type'] === 'Polygon') {
          this.mapCenter = this.location['coordinates'][0][0];
          //add mapCenter correctly.
        } else {
          console.log("ERROR: Invalid type.")
        }
      }
      this.loadMap();
      console.log('loading with existing data',this)
    }
  }

  onOkClick(): void {
    console.log("Submit Location Data")
    var featureCollection = this.draw.getAll()
    if (featureCollection.features[0]){
      this.dialogRef.close({location: featureCollection.features[0].geometry});
    } else {
      this.dialogRef.close({location: null});
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

  onDragEnd(event: any) {
    console.log('onDragEnd')
    //console.log(this)
    console.log(event)
    /*
    if (event) {
      var lngLat = event['target']['_lngLat']
      console.log(lngLat)
      this.lat = lngLat['lat'];
      this.lng = lngLat['lng'];
      console.log(this);
      console.log(this.draw)
      var featureCollection = this.draw.getAll()
      if(featureCollection.features[0]['geometry']['type'] === 'Point'){
        featureCollection.features[0]['geometry']['coordinates'] = [lngLat.lng,lngLat.lat]
        this.draw.set(featureCollection)
      }
    }
    */
  }

  onLoad(event: any): void {
    console.log("Map Load", event);

  }

  onZoomEnd(event: any) {

  }

  loadMap(): void {
    if(!this.isLoaded){
      console.log('loading map...')
      var error = null
      try {
        this.map = new Map({
          accessToken: this.token,
          container: 'location-map',
          style: this.style,
          zoom: this.zoom,
          center: [this.lng, this.lat] 
        });
        this.map.addControl(new NavigationControl());
        this.draw = new MapboxDraw(
          {controls: {
            point: true,
            polygon: true,
            trash: true
            },
            displayControlsDefault: false
          }
        );
        this.map.addControl(this.draw, 'top-right');
        this.marker = new Marker({draggable: false})
        .setLngLat([this.lng, this.lat])
        .addTo(this.map);
        console.log('this.marker',this.marker)
        //this.marker.on('dragend', this.onDragEnd);
        this.isLoaded = true;
      } catch (error) {
        console.log(error)
      } finally { //execute the rest of the code outside of the try/catch block
        if(this.map && !error){
          //add the control code.

          this.map.on('draw.create', e => {
            console.log('draw.create',e)
            var featureCollection = this.draw.getAll()
            if (featureCollection.features.length !== 1){
              featureCollection.features[0] = featureCollection.features.pop()
              this.draw.set(featureCollection)
            }
            var tempLoc = null
            if (featureCollection.features[0]['geometry']['type'] === 'Point'){
              tempLoc = featureCollection.features[0]['geometry']['coordinates']
            } else if (featureCollection.features[0]['geometry']['type'] === 'Polygon'){
              var sumlat = 0
              var sumlong = 0
              var count = 0
              //finding the center of the polygon.
              featureCollection.features[0]['geometry']['coordinates'][0].forEach((coord:any) => {
                sumlat += coord[0]
                sumlong += coord[1]
                count += 1
              })
              //console.log(sumlong,sumlat,count)
              tempLoc = [sumlat/count,sumlong/count];
            }
            if(this.map){
              if(this.marker){
                this.marker.setLngLat(tempLoc)
              } else {
                this.marker = new Marker({draggable: false})
                .setLngLat(tempLoc)
                .addTo(this.map);
                console.log('this.marker',this.marker)
                //this.marker.on('dragend', this.onDragEnd);
              }
            }
          });
      
          this.map.on('draw.delete', e => {
            console.log('draw.delete',e)
            var featureCollection = this.draw.getAll()
            featureCollection.features = []
            this.draw.set(featureCollection)
          });

          //create the initial feature.
          //current has a bug where this isn't visible until you interact with the map
          if (this.location && this.location['type']){
            var featureCollection = this.draw.getAll()
            var feature = {
              geometry: {
                coordinates: this.location['coordinates'],
                type: this.location['type']
              },
              id: 'initial64b3f1896dc2dc5eb642bfdb',
              properties: {},
              type: 'Feature'
            }
            //this.geojson = feature //pretty sure this is depreciated.
            featureCollection.features.push(feature)
            this.draw.set(featureCollection)
          }
      
          this.canvas = this.map.getCanvasContainer();
        }
      }
    } else {
      console.log('refreshing map')
    }
  }
  
  sleep (time: any): any {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

}
