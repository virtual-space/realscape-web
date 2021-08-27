import {Component, Input, OnInit} from '@angular/core';
import {Item} from "../services/item.service";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-item-content',
  templateUrl: './item-content.component.html',
  styleUrls: ['./item-content.component.scss']
})
export class ItemContentComponent implements OnInit {

  @Input() item: Item = null;

  constructor() { }

  ngOnInit() {
  }

  getContentUrl(): string {
    let result = null;
    if (this.item) {
      result = environment.api + (this.item.public ? '/public/items/' : '/items/') + this.item.id + '/data';
    }
    return result;
  }

}
