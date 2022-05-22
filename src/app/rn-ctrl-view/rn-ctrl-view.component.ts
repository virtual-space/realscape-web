import { Component, Input, OnInit , OnChanges, SimpleChanges, EventEmitter, Output} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { RnViewComponent } from '../rn-view/rn-view.component';
import { Item, ItemEvent, ItemService, itemIsInstanceOf, Type } from '../services/item.service';

@Component({
  selector: 'app-rn-ctrl-view',
  templateUrl: './rn-ctrl-view.component.html',
  styleUrls: ['./rn-ctrl-view.component.sass']
})
export class RnCtrlViewComponent extends RnViewComponent implements OnInit, OnChanges {
  @Input() control?: Item;
  @Input() layout?: string = "column";
  @Input() align?: string = "center center";
  @Input() gap?: string = "1%";
  @Input() formGroup?: FormGroup;
  @Output() onEvents = new EventEmitter<ItemEvent>();

  controls: Item[] = [];
  

  override ngOnInit(): void {
    //console.log('*************************************** ctrl view init', this.control);
    console.log(this);
    if(this.control) {
      console.log('*** control ', this.control);
      this.controls = this.getItemControls(this.control);
      console.log('*** controls ', this.controls);
      /*if(this.control.id) {
        this.itemService.children(this.control.id).subscribe(children => {
          //this.controls = children.filter(child => !child.type!.name!.endsWith("Ctrl"));
          this.controls = children;
        });
      }*/
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
