import {Component, Input, OnInit} from '@angular/core';
import {Item} from "../services/item.service";

@Component({
  selector: 'app-scene-view',
  templateUrl: './scene-view.component.html',
  styleUrls: ['./scene-view.component.scss']
})
export class SceneViewComponent implements OnInit {

  @Input() item: Item = null;
  @Input() items = [];
  constructor() { }

  ngOnInit() {
  }

  getContentUrl() {
    return null;
  }

}
