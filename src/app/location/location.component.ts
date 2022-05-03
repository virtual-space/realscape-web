import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
// import {LngLat, Map, Marker, Point} from "mapbox-gl";
// @ts-ignore
//marko import * as MapboxDraw from 'mapbox-gl-draw'; 
import {MatDialog} from "@angular/material/dialog";
import { features } from 'process';
import { range } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Map, NavigationControl, Marker } from 'mapbox-gl';
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
          //this.location = new LngLat(position.coords.longitude, position.coords.latitude);
          //this.mapCenter = this.location;
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          this.loadMap();
          console.log(this);
        });
      }
    } else {
      const loc = this.data.location;
      if (loc) {
          if(loc['type'] === 'Point') {
            this.lng = loc['coordinates'][0];
            this.lat = loc['coordinates'][1];
          }
      }
      // this.location = this.data.location;
      /*if (this.location) {
        
        if(this.location['type'] === 'Point'){
          this.mapCenter = this.location['coordinates'];
        } else {
          this.mapCenter = this.location['coordinates'][0][0];
        }
      }*/
      this.loadMap();
    }
  }

  onOkClick(): void {
    console.log("Submit Location Data")
    if (this.marker) {
      const loc = this.marker.getLngLat();
      this.dialogRef.close({location: {lng: loc.lng, lat: loc.lat}});
    }
    /*
    var featureCollection = this.draw.getAll()
    if (featureCollection.features[0]){
      this.dialogRef.close({location: featureCollection.features[0].geometry});
    } else {
      this.dialogRef.close({location: null});
    }*/
  }

  onCancelClick(): void {
    console.log("Close Edit Dialog")
    this.dialogRef.close();
  }

  onClearClick(): void {
    console.log("Clear Location Data")
    var featureCollection = this.draw.getAll()
    featureCollection.features = []
    this.draw.set(featureCollection)
    this.geojson = null
  }

  onDragEnd() {
    if (this.marker) {
      const lngLat = this.marker.getLngLat();
      this.lat = lngLat.lat;
      this.lng = lngLat.lng;
      console.log(this);
    }
  }

  onLoad(event: any): void {
    console.log("Map Load", event);
    //in this case, map is init in the html, then passed to the code.
    //this.map = event;

    //adding map controls
    /* Marko
    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        point: true,
        trash: true
      }
    });
    this.map.addControl(this.draw)
    

    if (this.location['type']){
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
      this.geojson = feature
      featureCollection.features.push(feature)
      this.draw.set(featureCollection)
    }

    this.map.on('draw.create', this.createFunction);
    this.map.on('draw.create', e => {
      console.log('draw.create2',e)
      var featureCollection = this.draw.getAll()
      if (featureCollection.features.length !== 1){
        featureCollection.features[0] = featureCollection.features.pop()
        this.draw.set(featureCollection)
      }
    })

    this.map.on('draw.delete', this.deleteFunction);
  
    this.map.on('draw.update', this.updateFunction);
  
    this.map.on('load', this.loadFunction);

    this.canvas = this.map.getCanvasContainer();
    */
    /* this.marker = new Marker({
      draggable: true
    }).setLngLat(this.location)
      .on('dragend', this.onDragEnd)
      .addTo(this.map); */
  }

  createFunction(e: any) {
    console.log("createFunction",e);
    if (this.geojson) {
      this.geojson = null;
    };
    this.geojson = e.features[0];
  }

  deleteFunction(e: any) {
    console.log("deleteFunction",e);
    this.geojson = null;
  }

  updateFunction(e: any) {
    console.log("updateFunction",e);
    if(e.features.id === this.geojson.id){
      this.geojson = e.features[0];
    }
  }

  loadFunction(e: any) {
    console.log('load function',e);
    console.log('log geojson for the map',this.geojson);
    this.draw.add(this.geojson);
  }

  onZoomEnd(event: any) {

    //console.log(this.marker);
    /* const center = this.map.getCenter();
    if (!this.marker) {
      this.marker = new Marker({
        draggable: true
      }).setLngLat([center.lng, center.lat])
        .on('dragend', this.onDragEnd)
        .addTo(this.map);
    } else {
      this.marker.setLngLat([center.lng, center.lat]);
    } */
    /*
    const markerLngLat = this.marker.getLngLat();
    const center = this.map.getCenter();
    const dLng = Math.abs(markerLngLat[0] - center.lng);
    const dLat = Math.abs(markerLngLat[1] - center.lat);

    if (dLng > 0.005 || dLat > 0.005) {
      this.marker.setLngLat(center);
    }*/
  }

  loadMap(): void {
    if(!this.isLoaded){
      console.log('loading map...')
      try {
        this.map = new Map({
          accessToken: this.token,
          container: 'location-map',
          style: this.style,
          zoom: this.zoom,
          center: [this.lng, this.lat] 
        });
        this.map.addControl(new NavigationControl());
        let draw = new MapboxDraw();
        this.map.addControl(draw, 'top-right'); 
        this.marker = new Marker({draggable: true})
                          .setLngLat([this.lng, this.lat])
                          .addTo(this.map);

        this.marker.on('dragend', this.onDragEnd);
        this.isLoaded = true;
      } catch (error) {
        console.log(error)
      }
    } else {
      console.log('refreshing map')
    }
  }
  
  

  sleep (time: any): any {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

}
