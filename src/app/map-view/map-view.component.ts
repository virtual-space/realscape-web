import {
  Component,
  Input,
  OnInit,
  NgZone,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
  OnDestroy
} from '@angular/core';
import {Marker, Map, SymbolLayout, LngLat, Popup, LngLatBounds,} from 'mapbox-gl';
import {Item, ItemService} from "../services/item.service";
import {ApplicationService} from "../services/application.service";
import {style} from "@angular/animations";
import {Observable, Subscription} from "rxjs";
import {DynamicComponentService} from "../services/dynamic-component.service";
import {ListItemComponent} from "../list-item/list-item.component";

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit, OnDestroy {

  @Input() item: Item = null;
  @Input() items = [];
  @Input() parent: Item = null;
  @Input() view: Item = null;
  @Input() location = new LngLat(0, 0);
  @Input() style = 'mapbox://styles/mapbox/streets-v9';
  @Input() threed = false;
  @Output() onAddFeature = new EventEmitter<any>();
  @Output() centerChanged = new EventEmitter<any>();

  @Input() events: Observable<void>;

  mapObject: Map;
  private eventsSubscription: Subscription;
  markers = [];

  labelLayerId: any;

  color = '#3887be';

  selection = {};

  constructor(private itemService: ItemService,
              private appService: ApplicationService,
              private dynamicComponentService: DynamicComponentService) { }

  ngOnInit() {
    this.eventsSubscription = this.events.subscribe(() => {
      console.log("MapRedraw");
      setTimeout(() => this.onRefreshMap());
    });
    if (this.item && this.item.point) {
      //this.mapObject.flyTo({ center: this.item.point['coordinates'] });
      this.location = new LngLat(this.item.point['coordinates'][0], this.item.point['coordinates'][1]);
    }
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  onLoadMap(mapInstance: Map) {
    //console.log("map onLoad");
    this.mapObject = mapInstance;
    if (this.item && this.item.point) {
      //this.mapObject.flyTo({ center: this.item.point['coordinates'] });
      this.location = new LngLat(this.item.point['coordinates'][0], this.item.point['coordinates'][1]);
    }
    if (this.items.length > 0) {
      this.updateMarkers(mapInstance);
    }
    //this.mapObject.resize();
    //console.log(this.mapObject);
    /*
    if (navigator.geolocation) {
      console.log("geolocation")
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
        mapInstance.setCenter(new LngLat(position.coords.longitude, position.coords.latitude));
        console.log("center set")
        mapInstance.resize();
        this.location = new LngLat(position.coords.longitude, position.coords.latitude);
        const layers = mapInstance.getStyle().layers!;

        for (let i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol' && (<SymbolLayout>layers[i].layout)['text-field']) {
            this.labelLayerId = layers[i].id;
            break;
          }
        }
      });
    } else {
      console.log("no geolocation")
    }
    */
  }

  attachPopup(marker, item) {

    const popup = new Popup({className: 'my-class'});
    popup.setLngLat(marker.getLngLat());
    let popupContent = this.dynamicComponentService.injectComponent(
      ListItemComponent,
      x => x.item = item);
    //popup.setHTML(`<b>${item.name}</b><br>${item.description}<br />`)
    popup.setDOMContent(popupContent);
    popup.setMaxWidth("300px");
    //popup.addTo(this.mapObject);
    marker.setPopup(popup);
    return popup;
  }

  updateMarkers(map) {

    let bounds = new LngLatBounds(); // Instantiate LatLngBounds object
    const itemsWithPositions = this.items.filter(i => i.point && i.point.coordinates);
    if (itemsWithPositions.length > 0) {
      console.log("fitting map to bounds");
      itemsWithPositions.forEach(ip => {
        /*const el = document.createElement('div');
        el.style.backgroundImage = 'url("/assets/breadcrumb-5px.png")';
        el.style.width = '5px';
        el.style.height = '5px';*/
        const m = new Marker();
        this.markers.push(m);
        m.setLngLat(ip.point.coordinates);
        this.attachPopup(m, ip);
        bounds = bounds.extend(ip.point.coordinates);
        m.addTo(map);
      });

      this.mapObject.fitBounds(bounds);
    }
  }

  onRefreshMap() {
    console.log("onRefreshMap");
    if (this.mapObject) {
      console.log("onRefreshMap::resize");
      this.mapObject.resize();
      if (this.items && this.items.length > 0) {
        this.updateMarkers(this.mapObject);
      }
      //this.mapObject.flyTo({ center: this.item.point['coordinates']  });
    }
  }

  onCenterChange(event) {
    if (this.centerChanged) {
      this.centerChanged.emit(this.mapObject.getCenter());
    }
   }
}
