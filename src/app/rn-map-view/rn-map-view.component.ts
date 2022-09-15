import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Map, NavigationControl, Marker, SymbolLayout, LngLat, Popup, LngLatBounds, LngLatBoundsLike, } from 'mapbox-gl';
import { Subscription } from 'rxjs';
// @ts-ignore
import * as MapboxDraw from "mapbox-gl-draw";
import * as mapboxgl from 'mapbox-gl';
import 'mapbox-gl-draw/dist/mapbox-gl-draw.css';

import { isInstanceOf, Item, ItemEvent, itemIsInstanceOf } from '../services/item.service'
import { environment } from 'src/environments/environment';
import { RnViewComponent } from '../rn-view/rn-view.component';
import { RnCardViewComponent } from '../rn-card-view/rn-card-view.component';
@Component({
  selector: 'app-rn-map-view',
  templateUrl: './rn-map-view.component.html',
  styleUrls: ['./rn-map-view.component.sass']
})
export class RnMapViewComponent extends RnViewComponent implements OnInit, OnDestroy {

  @ViewChild('mapElement') set content(content: ElementRef) {
    if(content) {
      //////console.log(content);

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
    ////console.log(this);
    if (this.item) {
      //this.items.push(this.item);
      this.location = this.getItemLocation(this.item);
      ////console.log(this.location);
      if (!this.location) {
        this.location = this.getMapCenter();
      }
      ////console.log(this.location);
      if (this.item.location == null) {
        if (navigator.geolocation) {
          ////console.log("getting the current location");
          navigator.geolocation.getCurrentPosition((position) => {
            //////console.log(position);
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
            this.sleep(500).then(() => {
              this.loadMap()
            });
          });
        }
      } else {
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
            ////console.log(this);
          } else {
            ////console.log("ERROR: Invalid type.")
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
    //////console.log('map received event ', e, 'index is ', this.tabIndex);
    let e = event.data['index'];
    if (e === this.tabIndex) {
      this.selectedTabIndex = e;
      this.loadMap()
    }
  }

  addToMap(location: any) {
    if (this.canAddItem()) {
      //////console.log('*** addToMap ***')
      let item: Item = this.item? { ... this.item} : new Item();
      item.location = location;
      this.onAdd(item);
    }
  }

  loadMap(): void {
    if(!this.isLoaded && (this.tabIndex === this.selectedTabIndex)){
      ////console.log('loading map...')
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
          ////console.log('draw.create',e);
          if (e['features'][0]['geometry']['type'] === 'Point') {
            ////console.log('Point');
            this.addToMap(e['features'][0]['geometry']);
            this.draw.delete(e['features'][0]['id']);
          } else if (e['features'][0]['geometry']['type'] === 'Polygon') {
            ////console.log('Polygon');
            this.addToMap(e['features'][0]['geometry']);
            this.draw.delete(e['features'][0]['id']);
          }
        });
        this.map.on('resize', event => {
          ////console.log(event);
          this.fitMapToBounds();
          //map.fitBounds(bounds);
        });

        /*this.map.on('load', this.onMapLoaded);
        this.map.on('draw.create', e => {
          ////console.log('draw.create',e)
          if (this.marker) {
            this.marker.remove();
            this.marker = undefined;
          }
        });

        this.map.on('draw.delete', e => {
          ////console.log('draw.delete',e)
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
      ////console.log('refreshing map')
    }
  }

  /*
  loadMap(): void {
    //////console.log("rn-map-view.this",this)
    var error = null;
    if(!this.isLoaded){
      ////console.log('loading map...')
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
        ////console.log('Error: Attempted to load map before tab is loaded.')
      } finally {
        if(!error){
          if(this.items.length !== 0 || (this.item && this.item.location)){
            if (this.map){
              this.loadFunction()
            }
          } else {
            ////console.log('No data provided')
          }
        }
      }
    } else {
      ////console.log('refreshing map')
      if(this.items.length !== 0 || (this.item && this.item.location)){
        if (this.map){
          //this needs to clear the existing map data.
          this.loadFunction()
        }
      } else {
        ////console.log('No data provided')
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

  itemHasLocation(item: Item): boolean {
    if (item.location && item.location.coordinates) {
      return true;
    } else if(item.linked_item) {
      return this.itemHasLocation(item.linked_item);
    } else {
      return false;
    }
  }

  getItemLocation(item: Item): any {
    if (item.location && item.location.coordinates) {
      return item.location;
    } else if(item.linked_item) {
      return this.getItemLocation(item.linked_item);
    } else {
      return undefined;
    }
  }

  getMapCenter(): any {
    if (this.item) {
      let location = this.getItemLocation(this.item);
      if (location) {
        return location;
      }
      let ips = this.getItemsWithPositions();
      //console.log(ips);
      if (ips.length > 0) {
        //console.log('4');
        var sumlat = 0
        var sumlong = 0
        var count = 0
        //finding the center of the polygon.
        ips.forEach(ip => {
          const loc = this.getItemLocation(ip);
          if (loc && loc.coordinates) {
            if (loc.type === 'Point') {
              sumlat += loc.coordinates[0];
              sumlong += loc.coordinates[1];
              count += 1
            } else if (loc.type === 'Polygon') {
              loc.coordinates[0].forEach((coord:any) => {
                sumlat += coord[0]
                sumlong += coord[1]
                count += 1
              })
            }
          }
        });
        return {'type': 'Point', 'coordinates': [sumlat/count, sumlong/count]}
      }
    }
    

    return undefined;
  }


  getItemsWithPositions(): Item[] {
    ////console.log(this.items);
    if (this.item && this.itemHasLocation(this.item)) {
      return this.items.filter(i => this.itemHasLocation(i)).concat(this.item);
    }
    return this.items.filter(i => this.itemHasLocation(i));
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
            ////console.log('Error: an item with a position is neither a point or a polygon.')
          }
        }
        //console.log(bounds);
        return bounds;
      }
    }

    return undefined;
  }

  correctBoundingBox(bb: LngLatBounds): LngLatBounds {
    const ne = bb.getNorthEast();
    const sw = bb.getSouthWest();
    const dlng = Math.abs(ne.lng - sw.lng);
    const dlat = Math.abs(ne.lat - sw.lat);
    const delta_lng = 0.001;
    const delta_lat = 0.001;
    
    if (dlng < 0.0001) {
      bb.extend([ne.lng + delta_lng, ne.lat]);
      bb.extend([ne.lng - delta_lng, ne.lat]);
      bb.extend([sw.lng + delta_lng, sw.lat]);
      bb.extend([sw.lng - delta_lng, sw.lat]);
    }

    if (dlat < 0.0001) {
      bb.extend([ne.lng, ne.lat + delta_lat]);
      bb.extend([ne.lng, ne.lat - delta_lat]);
      bb.extend([sw.lng, sw.lat + delta_lat]);
      bb.extend([sw.lng, sw.lat - delta_lat]);
    }
    ////console.log(lng, lat);
    return bb;
  }

  getBoundingBox() :LngLatBoundsLike {
    let bounds = new LngLatBounds();
    //view bounding box overrides the item ones
    //////console.log(this);
    const viewBounds = this.getViewLocationBounds();
    ////console.log('viewbounds ', viewBounds);
    if(viewBounds !== undefined) {
      return viewBounds;
    } else {
      this.getItemsWithPositions().forEach(ip => {
        ////console.log(ip);
        const loc = this.getItemLocation(ip);
        if (loc) {
          if(loc.type === 'Point'){
            bounds = bounds.extend(loc.coordinates);
          } else {
            if (loc.type === 'Polygon'){
              loc.coordinates[0].forEach((coord:any) => {
                bounds = bounds.extend(coord);
              })
            } else {
              ////console.log('Error: an item with a position is neither a point or a polygon.')
            }
          }
        }
      });
      bounds = this.correctBoundingBox(bounds);
      ////console.log(bounds);
      return bounds;
    }

    ////console.log(bounds);
    return bounds;
  }

  fitMapToBounds() {
    ////console.log('fitting map to bounds');
    const bb = this.getBoundingBox();
    if (bb) {
      this.map?.fitBounds(bb);
    }

    //this.map?.setZoom(15);
  }

  loadMarkers(map: Map): void {
    ////console.log("loading markers")
    if(map){
       // Instantiate LatLngBounds object
      const itemsWithPositions = this.getItemsWithPositions();
      ////console.log(itemsWithPositions);
      if (itemsWithPositions.length > 0) {
        itemsWithPositions.forEach(ip => {
          const loc = this.getItemLocation(ip);
          if (loc) {
            if(loc.type == 'Point'){
              ////console.log("adding point...", ip.name)
              let customMarkerIcon = undefined;
              let icon = this.getItemIcon(ip);
              if (icon) {
                customMarkerIcon = document.createElement('div');
                customMarkerIcon.className = 'marker';
                customMarkerIcon.innerHTML = `<div fxLayout='column' fxLayoutAlign='center center'><div class="material-icons">${icon}</div><div>${ip.name}</div></div>`
              }
              const m = new Marker(customMarkerIcon);
              this.markers.push(m);
              m.setLngLat(loc.coordinates);
              this.attachPopup(ip, m);
              m.addTo(map);
            } else if (loc.type === 'Polygon'){
              ////console.log("adding polygon...", ip.name)
              var sumlat = 0
              var sumlong = 0
              var count = 0
              //finding the center of the polygon.
              loc.coordinates[0].forEach((coord:any) => {
                sumlong += coord[0]
                sumlat += coord[1]
                count += 1
              })
  
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
                map.on('click', 'l' + ip.id, (e) => {
                  if (e) {
                    this.attachPopup(ip, map, { lngLat: e.lngLat });
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
                let customMarkerIcon = undefined;
                let icon = this.getItemIcon(ip);
                if (icon) {
                  customMarkerIcon = document.createElement('div');
                  customMarkerIcon.className = 'marker';
                  customMarkerIcon.innerHTML = `<div fxLayout='column' fxLayoutAlign='center center'><div class="material-icons">${icon}</div><div>${ip.name}</div></div>`
                }
                const m = new Marker(customMarkerIcon);
                this.markers.push(m);
                m.setLngLat(new LngLat(sumlong/count, sumlat/count));
                //this.attachPopup(ip, m);
                m.addTo(map);
              } else {
                ////console.log(`Error: The item somehow doesn't have a name. item:`,ip)
              }
            } else {
              ////console.log('Error: an item with a position is neither a point or a polygon.')
            }
          }
        });
      }
    } else {
      ////console.log("sequencing error: loadMarkers has occured before the map has loaded.")
    }
    this.fitMapToBounds();
  }

  attachPopup(item: Item, mapOrMarker: Marker | Map, options?: { lngLat: mapboxgl.LngLatLike}): void {
    let popupContent: any = this.createPopup(item);

    const divContainer = document.createElement('div');
    divContainer.appendChild(popupContent.location.nativeElement);

    const popup = new Popup();
    popup.setDOMContent(divContainer);
    popup.setMaxWidth("300px");

    if (mapOrMarker instanceof Marker) {
      popup.setLngLat(mapOrMarker.getLngLat());
      mapOrMarker.setPopup(popup);
    } else {
      if (options && options.lngLat) {
        popup.setLngLat(options.lngLat);
      }
      popup.addTo(mapOrMarker);
    }
  }

  createPopup(item: Item): any {
    const componentRef = this.viewContainerRef.createComponent(RnCardViewComponent);
    componentRef.instance.item = item;

    return componentRef;
  }

  private sleep (time: any): any {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

}
