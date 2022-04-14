import { Component, Input, OnInit } from '@angular/core';
import { Item, ItemService } from '../services/item.service';

@Component({
  selector: 'app-rn-ctrl-view',
  templateUrl: './rn-ctrl-view.component.html',
  styleUrls: ['./rn-ctrl-view.component.sass']
})
export class RnCtrlViewComponent implements OnInit {
  @Input() control?: Item;
  controls: Item[] = [];
  
  constructor(private itemService: ItemService) { }

  ngOnInit(): void {
    if(this.control && this.control.id) {
      this.itemService.children(this.control.id).subscribe(children => {
        //this.controls = children.filter(child => !child.type!.name!.endsWith("Ctrl"));
        this.controls = children;
      });
    }
  }

}
