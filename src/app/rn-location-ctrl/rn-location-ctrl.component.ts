import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
// import {LngLat, Map, Marker, Point} from "mapbox-gl";
// @ts-ignore
//marko import * as MapboxDraw from 'mapbox-gl-draw'; 
import {MatDialog} from "@angular/material/dialog";
import { features } from 'process';
import { range, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LngLat, Map, NavigationControl, Marker } from 'mapbox-gl';
// @ts-ignore
import * as MapboxDraw from "mapbox-gl-draw";
// @ts-ignore
import * as MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import 'mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { RnCtrlComponent } from '../rn-ctrl/rn-ctrl.component';
import { Item, ItemEvent } from '../services/item.service';

@Component({
  selector: 'app-rn-location-ctrl',
  templateUrl: './rn-location-ctrl.component.html',
  styleUrls: ['./rn-location-ctrl.component.sass']
})
export class RnLocationCtrlComponent extends RnCtrlComponent implements OnInit {

  //location?: LngLat;
  public geojson: any;
  //map?: Map;
  public draw: any;
  private canvas: any;
  location: any;
  subscription?: Subscription;

  isLoaded = false;
  marker?: Marker;
  map?: Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 45.899977;
  lng = 6.172652;
  zoom = 15;
  token = environment.mapboxToken;

  //REMOVE THE MARKERS FROM POLYGON
  //REMOVE THE DELETE METHOD

  override ngOnInit(): void {
    if (!this.item || (this.item.location == null)) {
      if (navigator.geolocation) {
        //console.log("getting the current location");
        navigator.geolocation.getCurrentPosition((position) => {
          //console.log(position);
          this.location = {
            coordinates: [position.coords.longitude, position.coords.latitude],
            type: "Point"
          }
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          /*
          this.sleep(500).then(() => {//do not remove the sleep functions
            this.loadMap();//this fixes 99% of the loading issues
          });*/
          //console.log('loading with user location',this);
        });
      }
    } else {
      this.location = this.item.location;
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
          //console.log(this);
        } else {
          console.log("ERROR: Invalid type.")
        }
      }
      /*
      this.sleep(500).then(() => {
        this.loadMap();
      });*/
      //console.log('loading with existing data',this)
    }
    
    this.rebuildFormControl();
    if (this.events) {
      //console.log('subscribing')
      this.subscription = this.events.subscribe(e => {
        this.handleEvent(e);
      });
    }
  }

  override itemChanged(item?: Item): void {
    this.rebuildFormControl();
  }

  rebuildFormControl() {
    //console.log(this.formControl);
    //this.formControl.setValue(this.getValue());
    

    if(this.formGroup) {
      this.formGroup.removeControl('location');
      this.formGroup.addControl('location', this.formControl);
      if(this.location) {
        this.formControl.setValue(JSON.stringify(this.location));
        console.log(JSON.stringify(this.location));
      }
    }
  }

  onCancelClick(): void {
    console.log("Close Edit Dialog")
    //this.dialogRef.close();
  }

  onClearClick(): void {
    //console.log("Clear Location Data")
    var featureCollection = this.draw.getAll()
    featureCollection.features = []
    this.draw.set(featureCollection)
    if(this.marker && this.map){
      this.marker.remove()
    }
  }

  onLoad(event: any): void {
    console.log("Map Load", event);
  }

  onZoomEnd(event: any) {

  }

  loadMap(): void {
    if(!this.isLoaded){
      //console.log('loading map...')
      var error = null
      try {
        this.map = new Map({
          accessToken: this.token,
          container: 'location-map',
          style: this.style,
          zoom: this.zoom,
          center: [this.lng, this.lat] 
        });
        this.map.addControl(new MapboxGeocoder({
            accessToken: this.token,
            mapboxgl: this.map
        }));
        this.map.addControl(new NavigationControl());
        this.draw = new MapboxDraw(
          {controls: {
            point: true,
            polygon: true,
            //trash: true
            },
            displayControlsDefault: false
          }
        );
        this.map.addControl(this.draw, 'top-right');
        this.marker = new Marker({draggable: false})
        .setLngLat([this.lng, this.lat])
        //console.log('this.marker',this.marker)
        //this.marker.on('dragend', this.onDragEnd);
        this.marker.on('dragend', () =>{
          if(this.marker){
            const lngLat: LngLat = this.marker.getLngLat()
            //console.log(lngLat)
            var featureCollection = this.draw.getAll()
            if(featureCollection.features[0]['geometry']['type'] === 'Point'){
              featureCollection.features[0]['geometry']['coordinates'] = [lngLat.lng,lngLat.lat];
              this.draw.set(featureCollection);
              this.formControl.setValue(JSON.stringify(featureCollection.features[0].geometry));
              console.log(this.formControl);
              console.log(this.formGroup);
            }
          }
        });
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
              this.draw.set(featureCollection);
            }
            if (featureCollection.features[0]['geometry']['type'] === 'Point'){
              if(this.marker && this.map){
                this.marker.setLngLat(featureCollection.features[0]['geometry']['coordinates'])
                this.marker.setDraggable(true)
                this.marker.addTo(this.map)
                this.formControl.setValue(JSON.stringify(featureCollection.features[0].geometry));
                //console.log(this.formControl);
                //console.log(this.formGroup);
              }
            } else if (featureCollection.features[0]['geometry']['type'] === 'Polygon'){
              if(this.marker){
                this.marker.remove()
              }
              this.formControl.setValue(JSON.stringify(featureCollection.features[0].geometry));
              //console.log(this.formControl);
              //console.log(this.formGroup);
            }
          });
          
          /*//removed since this will not be called while the trash control is commented out.
          this.map.on('draw.delete', e => {
            console.log('draw.delete',e)
            var featureCollection = this.draw.getAll()
            featureCollection.features = []
            this.draw.set(featureCollection)
            if(this.marker){this.marker.remove()}
          });*/

          this.map.on('draw.update', e => {
            if(this.marker){
              //console.log('draw.update',e)
              var featureCollection = this.draw.getAll()
              //console.log(featureCollection)
              if(featureCollection.features[0]['geometry']['type'] === 'Point'){
                //console.log('point')
                //console.log(featureCollection.features[0]['geometry']['coordinates'])
                this.marker.setLngLat(featureCollection.features[0]['geometry']['coordinates']);
                this.formControl.setValue(JSON.stringify(featureCollection.features[0].geometry));
                //console.log(this.formControl);
                //console.log(this.formGroup);
              } else if (featureCollection.features[0]['geometry']['type'] === 'Polygon'){
                this.formControl.setValue(JSON.stringify(featureCollection.features[0].geometry));
                //console.log(this.formControl);
                //console.log(this.formGroup);
              }
            }
          });
          
          //create the initial feature.
          //there is a bug where polygons do not load, this fixes most of them.
          this.sleep(750).then(() => {
            if (this.location && this.location['type']){
              if(this.marker && this.location['type'] === 'Point'){
                this.marker.setDraggable(true)
                if(this.map){
                  this.marker.addTo(this.map)
                }
              }
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
          })
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

  handleEvent(event: ItemEvent) {
    console.log('map received event ', event, 'tab index is ', this.tabIndex);
    let e = event.data['index'];
    if (e === this.tabIndex) {
      this.loadMap();
    }
  }

  /*
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
  */

}
