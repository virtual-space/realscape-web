import { Component, OnInit, Input } from '@angular/core';
import { Item } from '../services/item.service';

@Component({
  selector: 'app-rn-view',
  templateUrl: './rn-view.component.html',
  styleUrls: ['./rn-view.component.sass']
})
export class RnViewComponent implements OnInit {

  @Input() view?: Item;
  @Input() items: Item[] = [];
  constructor() { }

  ngOnInit(): void {
  }

}
