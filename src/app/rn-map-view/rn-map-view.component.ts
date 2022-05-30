import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
//import * as mapboxgl from "mapbox-gl";

import { isInstanceOf, Item, ItemEvent, itemIsInstanceOf } from '../services/item.service'
//import * as MapboxGl from '!mapbox-gl';

//const mapboxgl:any = require('mapbox-gl/dist/mapbox-gl.js');
//const mapboxgl:any = require('mapbox-gl');

import { RnListViewComponent } from '../rn-list-view/rn-list-view.component';
import { environment } from 'src/environments/environment';
import { Map, NavigationControl, Marker, SymbolLayout, LngLat, Popup, LngLatBounds, LngLatBoundsLike, } from 'mapbox-gl';
import { RnViewComponent } from '../rn-view/rn-view.component';
import { Subscription } from 'rxjs';
import { E } from '@angular/cdk/keycodes';
import { createComponentDefinitionMap } from '@angular/compiler/src/render3/partial/component';
// @ts-ignore
import * as MapboxDraw from "mapbox-gl-draw";
import 'mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { RnDialogComponent } from '../rn-dialog/rn-dialog.component';

@Component({
  selector: 'app-rn-map-view',
  templateUrl: './rn-map-view.component.html',
  styleUrls: ['./rn-map-view.component.sass']
})
export class RnMapViewComponent extends RnViewComponent implements OnInit, OnDestroy {

  @ViewChild('mapElement') set content(content: ElementRef) {
    if(content) {
      //console.log(content);
      
    }
  }

  public draw: any;
  isLoaded = false;
  subscription?: Subscription;
  map?: Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 45.899977;
  lng = 6.172652;
  //location = {'type': 'Point','coordinates': [this.lng,this.lat] }
  location:any = null;
  zoom = 19;
  token = environment.mapboxToken;
  markers: Marker[] = [];
  selectedTabIndex = 0;

  override ngOnInit(): void {
    if (this.item) {
      //this.items.push(this.item);
      if (this.item.location == null) {
        if (navigator.geolocation) {
          console.log("getting the current location");
          navigator.geolocation.getCurrentPosition((position) => {
            //console.log(position);
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
            this.sleep(500).then(() => {
              this.loadMap()
            });
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
            console.log(this);
          } else {
            console.log("ERROR: Invalid type.")
          }
        }
        this.sleep(500).then(() => {
          this.loadMap()
        });
      }
    }
    if (this.events) {
      this.subscription = this.events.subscribe(e => {
        this.handleEvent(e);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  handleEvent(event: ItemEvent) {
    //console.log('map received event ', e, 'index is ', this.tabIndex);
    let e = event.data['index'];
    if (e === this.tabIndex) {
      this.selectedTabIndex = e;
      this.loadMap()
    }
  }

  addToMap(location: any) {
    if (this.canAddItem()) {
      let item: Item = this.item? { ... this.item} : new Item();
      item.location = location;
      this.onAdd(item);
    }
  }

  loadMap(): void {
    if(!this.isLoaded && (this.tabIndex === this.selectedTabIndex)){
      console.log('loading map...')
      this.map = new Map({
        accessToken: this.token,
        container: 'map',
        style: this.style,
        zoom: this.zoom,
        center: [this.lng, this.lat] 
      });
      this.map.addControl(new NavigationControl());
        this.draw = new MapboxDraw(
          {
            controls: 
            {
              point: true,
              polygon: true
            },
            displayControlsDefault: false,
            userProperties: true
          }
        );
        this.map.addControl(this.draw, 'top-right');
        this.map.on('draw.create', e => {
          console.log('draw.create',e);
          if (e['features'][0]['geometry']['type'] === 'Point') {
            console.log('Point');
            this.addToMap(e['features'][0]['geometry']);
            this.draw.delete(e['features'][0]['id']);
          } else if (e['features'][0]['geometry']['type'] === 'Polygon') {
            console.log('Polygon');
            this.addToMap(e['features'][0]['geometry']);
            this.draw.delete(e['features'][0]['id']);
          }
        });
        this.map.on('resize', event => {
          console.log(event);
          this.fitMapToBounds();
          //map.fitBounds(bounds);
        });
        
        /*this.map.on('load', this.onMapLoaded);
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
        */
        this.sleep(500).then(() => {

          if(this.map){
            this.loadMarkers(this.map);
          }
        });
        
        
        
    } else {
      console.log('refreshing map')
    }
  }

  /*
  loadMap(): void {
    //console.log("rn-map-view.this",this)
    var error = null;
    if(!this.isLoaded){
      console.log('loading map...')
      try {
        this.map = new Map({
          accessToken: this.token,
          container: 'map',
          style: this.style,
          zoom: this.zoom,
          center: [this.lng, this.lat] 
        });
        this.map.addControl(new NavigationControl());
        this.isLoaded = true;
      } catch (error) {
        console.log('Error: Attempted to load map before tab is loaded.')
      } finally {
        if(!error){
          if(this.items.length !== 0 || (this.item && this.item.location)){
            if (this.map){
              this.loadFunction()
            }
          } else {
            console.log('No data provided')
          }
        }
      }
    } else {
      console.log('refreshing map')
      if(this.items.length !== 0 || (this.item && this.item.location)){
        if (this.map){
          //this needs to clear the existing map data.
          this.loadFunction()
        }
      } else {
        console.log('No data provided')
      }
    }
  }
  */

  /*
  Always call this instead of directly calling loadMarkers.
  */
  private loadFunction(): void {
    this.sleep(100).then(() => {
      if(this.map){
        this.loadMarkers(this.map)
      }
    });
  }

  /* 
  Do not call this directly, use the loadFunction() provided to delay this until after the map finishes loading.
  */

  getItemsWithPositions(): Item[] {
    if (this.item && this.item.location && this.item.location.coordinates) {
      return this.items.filter(i => i.location && i.location.coordinates).concat(this.item);
    }
    return this.items.filter(i => i.location && i.location.coordinates);
  }

  getViewLocationBounds(): LngLatBoundsLike | undefined {
    if (this.item && this.item.items)
    {
      const view = this.item.items.find((item,index) => itemIsInstanceOf(item, 'MapView') && (index === this.tabIndex));
    
      if (view && view.location) {
        
        let bounds = new LngLatBounds();
        if(view.location.type === 'Point'){
          bounds = bounds.extend(view.location.coordinates);
        } else {
          if (view.location.type === 'Polygon'){
            view.location.coordinates[0].forEach((coord:any) => {
              bounds = bounds.extend(coord);
            })
          } else {
            console.log('Error: an item with a position is neither a point or a polygon.')
          }
        }
        return bounds;
      }
    }
    
    return undefined;
  }

  getBoundingBox() :LngLatBoundsLike {
    let bounds = new LngLatBounds();
    //view bounding box overrides the item ones
    //console.log(this);
    const viewBounds = this.getViewLocationBounds();
    console.log('viewbounds ', viewBounds);
    if(viewBounds !== undefined) {
      return viewBounds;
    } else {
      this.getItemsWithPositions().forEach(ip => {
        console.log(ip);
        if(ip.location.type === 'Point'){
          bounds = bounds.extend(ip.location.coordinates);
        } else {
          if (ip.location.type === 'Polygon'){
            ip.location.coordinates[0].forEach((coord:any) => {
              bounds = bounds.extend(coord);
            })
          } else {
            console.log('Error: an item with a position is neither a point or a polygon.')
          }
        }
      });
      return bounds;
    }
    
    console.log(bounds);
    return bounds;
  }

  fitMapToBounds() {
    console.log('fitting map to bounds');
    const bb = this.getBoundingBox();
    if (bb) {
      this.map?.fitBounds(bb);
    }
    
    //this.map?.setZoom(15);
  }

  loadMarkers(map: Map): void {
    console.log("loading markers")
    if(map){
       // Instantiate LatLngBounds object
      const itemsWithPositions = this.getItemsWithPositions();
      if (itemsWithPositions.length > 0) {
        itemsWithPositions.forEach(ip => {
          if(ip.location.type === 'Point'){
            console.log("adding point...", ip.name)
            const m = new Marker();
            this.markers.push(m);
            m.setLngLat(ip.location.coordinates);
            this.attachPopup(m, ip);
            m.addTo(map);
          } else if (ip.location.type === 'Polygon'){
            console.log("adding polygon...", ip.name)
            //const m = new Marker();
            //this.markers.push(m);
            var sumlat = 0
            var sumlong = 0
            var count = 0
            //finding the center of the polygon.
            ip.location.coordinates[0].forEach((coord:any) => {
              sumlat += coord[0]
              sumlong += coord[1]
              count += 1
            })
            //console.log(sumlat,sumlong,count)
            //m.setLngLat([sumlat/count,sumlong/count]);
            //this.attachPopup(m, ip);
            //m.addTo(map);
            //now add the polygon itself.
            //console.log('current polygon',ip)
            if(ip.id){
              map.addSource(ip.id,{
                'type': 'geojson',
                'data': {
                  'properties': {
                    'name': ip.name
                  },
                  'type': 'Feature',
                  'geometry': {
                    'type': 'Polygon',
                    'coordinates': ip.location.coordinates
                  }
                }
              })
              map.addLayer({
                'id': 'l' + ip.id,
                'type': 'fill',
                'source': ip.id, // reference the data source
                'layout': {},
                'paint': {
                  'fill-color': '#0080ff', // blue color fill
                  'fill-opacity': 0.5
                }
              });
              let popupLink = this.itemService.getLink(ip);
              map.on('click', 'l' + ip.id, (e) => {
                if (e) {
                  new Popup()
                    .setLngLat(e.lngLat)
                    .setHTML('<h3><a href="' + popupLink + '">' + ip.name + '</a></h3>')
                    .addTo(map);
                }
                
                });
              map.addLayer({
                'id': 'l' + ip.id + 'outline',
                'type': 'line',
                'source': ip.id, // reference the data source
                'layout': {},
                'paint': {
                  'line-color': '#000',
                  'line-width': 3
                }
              })
            } else {
              console.log(`Error: The item somehow doesn't have a name. item:`,ip)
            }
          } else {
            console.log('Error: an item with a position is neither a point or a polygon.')
          }
        });
      }
    } else {
      console.log("sequencing error: loadMarkers has occured before the map has loaded.")
    }
    this.fitMapToBounds();
  }

  attachPopup(marker: Marker, item: Item): any {
    const popup = new Popup({className: 'my-class'});
    popup.setLngLat(marker.getLngLat());
    //let popupContent: any = this.createPopup(item)
    //console.log(popupContent)
    let popupLink = this.itemService.getLink(item);
    popup.setHTML('<h3><a href="' + popupLink + '">' + item.name + '</a></h3>')
    //popup.setDOMContent(popupContent);
    popup.setMaxWidth("300px");
    marker.setPopup(popup);
    return popup;
  }

  /* 
  This is supposed to dynamically create a component and be loaded with popup.setDOMContent()
  Currently just exploratory for how to create a node object without using component factory.
  */
 /*
  createPopup(item: Item): any {
    
    const listComp = new RnListViewComponent(
      this.itemService,
      this.sessionService,
      this.authService,
      this.sanitizer,
      this.route,
      this.dialog,
      this.snackBar,
      this.viewContainerRef
    );
    listComp.items = [item];
    const viewContainerRef = listComp.viewContainerRef;
    viewContainerRef.clear();
    console.log('container ref',viewContainerRef)
    const componentRef = viewContainerRef.createComponent(RnListViewComponent)
    console.log('container ref2',viewContainerRef)
    console.log('listcomp',listComp)
    return componentRef;
    
  }*/

  private sleep (time: any): any {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

}
