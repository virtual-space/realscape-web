import { Component, Input, OnInit , OnChanges, SimpleChanges, EventEmitter, Output} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Item, ItemEvent, ItemService, itemIsInstanceOf, Type } from '../services/item.service';

@Component({
  selector: 'app-rn-ctrl-view',
  templateUrl: './rn-ctrl-view.component.html',
  styleUrls: ['./rn-ctrl-view.component.sass']
})
export class RnCtrlViewComponent implements OnInit, OnChanges {
  @Input() control?: Item;
  @Input() item?: Item;
  @Input() layout?: string = "column";
  @Input() align?: string = "center center";
  @Input() gap?: string = "1%";
  @Input() formGroup?: FormGroup;
  @Output() onEvents = new EventEmitter<ItemEvent>();
  @Input() events?: Observable<number>;
  @Input() tabIndex?: number;
  controls: Item[] = [];
  
  constructor(private itemService: ItemService) { }

  ngOnInit(): void {
    //console.log('*************************************** hello from ctrl view init');
    //console.log(this.item);
    if(this.control) {
      if(this.control.items) {
          this.controls = this.control.items;
      } else if(this.control.id) {
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

  collectTypeAttributes(type: Type, attrs: {[index: string]:any}) {
    let ret = attrs;
    //console.log('collecting type attributes ', type.name!);
    if (type) {
      if (type.base) {
        attrs = Object.assign(attrs, this.collectTypeAttributes(type.base, attrs));
      }
      if (type.attributes) {
        attrs = Object.assign(attrs, type.attributes);
      }
    }
    
    return ret;
  }

  getControlAttribute(key: string, def: string, control?: Item): string {
    if(this.control) {
      const attributes = this.collectTypeAttributes(this.control.type!, this.control.attributes? this.control.attributes : {});
       if(attributes) {
         const ret = attributes[key];
         if (ret) {
           return ret;
         }
       }
    }  

    return def;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['item']) {
      //console.log('*************************************** hello from ctrl view changed!!!');
      //console.log(this.item);
    }
  }

  isButton(item: Item) {
    return itemIsInstanceOf(item, "ButtonCtrl");
  }

  isForm(item: Item) {
    return itemIsInstanceOf(item, "FormCtrl");
  }

  isTabs(item: Item) {
    return itemIsInstanceOf(item, "TabsCtrl");
  }

}
