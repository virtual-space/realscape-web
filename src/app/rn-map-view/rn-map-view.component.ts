import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
//import * as mapboxgl from "mapbox-gl";

import { Item } from '../services/item.service'
//import * as MapboxGl from '!mapbox-gl';

//const mapboxgl:any = require('mapbox-gl/dist/mapbox-gl.js');
//const mapboxgl:any = require('mapbox-gl');

import { Map, NavigationControl } from 'mapbox-gl';
import { RnViewComponent } from '../rn-view/rn-view.component';
//import * as mapboxgl from "mapbox-gl";

@Component({
  selector: 'app-rn-map-view',
  templateUrl: './rn-map-view.component.html',
  styleUrls: ['./rn-map-view.component.sass']
})
export class RnMapViewComponent extends RnViewComponent implements OnInit {

  @ViewChild('mapElement') set content(content: ElementRef) {
    if(content) {
      console.log(content);
      this.map = new Map({
        accessToken: this.token,
        container: 'map1',
        style: this.style,
        zoom: this.zoom,
        center: [this.lng, this.lat] 
      });
      this.map.addControl(new NavigationControl());
    }
  }

  map?: Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 45.899977;
  lng = 6.172652;
  zoom = 12;
  token = 'pk.eyJ1IjoidjFydHU0bHNwNGMzIiwiYSI6ImNreW1mZXI5ZzA2aHQydG5zY2hiNWh0ZjAifQ.BovKKecsXgBq1wu7PlAUHQ';

  public override onActivate(): void {
    console.log('map view activate');
  }

}
