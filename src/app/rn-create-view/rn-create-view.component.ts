import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../services/item.service';

@Component({
  selector: 'app-rn-create-view',
  templateUrl: './rn-create-view.component.html',
  styleUrls: ['./rn-create-view.component.sass']
})
export class RnCreateViewComponent implements OnInit {
  @Input() items: Item[] = [];
  constructor() { }

  ngOnInit(): void {
  }

}
