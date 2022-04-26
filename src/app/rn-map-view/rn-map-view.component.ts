import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
//import * as mapboxgl from "mapbox-gl";

import { Item } from '../services/item.service'
//import * as MapboxGl from '!mapbox-gl';

//const mapboxgl:any = require('mapbox-gl/dist/mapbox-gl.js');
//const mapboxgl:any = require('mapbox-gl');

import { environment } from 'src/environments/environment';

import { Map, NavigationControl } from 'mapbox-gl';
import { RnViewComponent } from '../rn-view/rn-view.component';
import { Subscription } from 'rxjs';
//import * as mapboxgl from "mapbox-gl";

@Component({
  selector: 'app-rn-map-view',
  templateUrl: './rn-map-view.component.html',
  styleUrls: ['./rn-map-view.component.sass']
})
export class RnMapViewComponent extends RnViewComponent implements OnInit, OnDestroy {

  @ViewChild('mapElement') set content(content: ElementRef) {
    if(content) {
      console.log(content);
      
    }
  }

  isLoaded = false;
  subscription?: Subscription;
  map?: Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 45.899977;
  lng = 6.172652;
  zoom = 12;
  token = environment.mapboxToken;

  override ngOnInit(): void {
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

  handleEvent(e: number) {
    console.log('map received event ', e, 'index is ', this.tabIndex);
    if (e === this.tabIndex) {
      this.loadMap()
    }
  }

  loadMap(): void {
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
        console.log(error)
      }
    } else {
      console.log('refreshing map')
    }
  }

}
