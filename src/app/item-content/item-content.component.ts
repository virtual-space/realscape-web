import {Component, Input, OnInit} from '@angular/core';
import {Item, ItemService} from "../services/item.service";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-item-content',
  templateUrl: './item-content.component.html',
  styleUrls: ['./item-content.component.scss']
})
export class ItemContentComponent implements OnInit {

  @Input() item: Item = null;

  constructor(private itemService: ItemService) { }

  ngOnInit() {
  }

  getContentUrl(): string {
    let result = null;
    if (this.item) {
      result = this.itemService.getDataLink(this.item.id);
    }
    return result;
  }

}
