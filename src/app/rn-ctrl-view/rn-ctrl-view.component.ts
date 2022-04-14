import { Component, Input, OnInit } from '@angular/core';
import { Item, ItemService } from '../services/item.service';

@Component({
  selector: 'app-rn-ctrl-view',
  templateUrl: './rn-ctrl-view.component.html',
  styleUrls: ['./rn-ctrl-view.component.sass']
})
export class RnCtrlViewComponent implements OnInit {
  @Input() control?: Item;
  @Input() layout?: string = "column";
  @Input() align?: string = "center center";
  @Input() gap?: string = "1%";
  controls: Item[] = [];
  
  
  constructor(private itemService: ItemService) { }

  ngOnInit(): void {
    if(this.control) {
      if(this.control.id) {
        this.itemService.children(this.control.id).subscribe(children => {
          //this.controls = children.filter(child => !child.type!.name!.endsWith("Ctrl"));
          this.controls = children;
        });
      }
      if(this.control.attributes) {
        const layout = this.control.attributes['layout'];
        if(layout) {
          this.layout = layout;
        }
        const align = this.control.attributes['align'];
        if(align) {
          this.align = align;
        }
        const gap = this.control.attributes['gap'];
        if(gap) {
          this.gap = gap;
        }
      }
    }
  }

  getControlAttribute(key: string, def: string, control?: Item): string {
    if(control) {
       if(control.attributes) {
         const ret = control.attributes[key];
         if (ret) {
           return ret;
         }
       }
    } 

    return def;
  }

}
