import { Component, Input, OnInit } from '@angular/core';
//import * as mapboxgl from "mapbox-gl";

import { Item } from '../services/item.service'
//import * as MapboxGl from '!mapbox-gl';

//const mapboxgl:any = require('mapbox-gl/dist/mapbox-gl.js');
//const mapboxgl:any = require('mapbox-gl');

import { Map, NavigationControl } from 'mapbox-gl';
//import * as mapboxgl from "mapbox-gl";

@Component({
  selector: 'app-rn-map-view',
  templateUrl: './rn-map-view.component.html',
  styleUrls: ['./rn-map-view.component.sass']
})
export class RnMapViewComponent implements OnInit {

  @Input() items: Item[] = []
  map?: Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 45.899977;
  lng = 6.172652;
  zoom = 12;
  token = 'pk.eyJ1IjoidjFydHU0bHNwNGMzIiwiYSI6ImNreW1mZXI5ZzA2aHQydG5zY2hiNWh0ZjAifQ.BovKKecsXgBq1wu7PlAUHQ';

  constructor() { 
  }

  ngOnInit(): void {
    this.map = new Map({
      accessToken: this.token,
      container: 'map',
      style: this.style,
      zoom: this.zoom,
      center: [this.lng, this.lat] 
    });
    this.map.addControl(new NavigationControl());
  }

}
