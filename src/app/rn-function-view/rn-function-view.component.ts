import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../services/item.service';

@Component({
  selector: 'app-rn-function-view',
  templateUrl: './rn-function-view.component.html',
  styleUrls: ['./rn-function-view.component.sass']
})
export class RnFunctionViewComponent implements OnInit {
  @Input() items: Item[] = [];
  content = ""
  constructor() { }

  ngOnInit(): void {
  }

}
