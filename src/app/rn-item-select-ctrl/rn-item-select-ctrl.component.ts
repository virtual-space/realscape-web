import { Component, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { RnCtrlComponent } from '../rn-ctrl/rn-ctrl.component';
import { Item, itemIsInstanceOf, isInstanceOf, Query, Type } from '../services/item.service';

@Component({
  selector: 'app-rn-item-select-ctrl',
  templateUrl: './rn-item-select-ctrl.component.html',
  styleUrls: ['./rn-item-select-ctrl.component.sass']
})
export class RnItemSelectCtrlComponent extends RnCtrlComponent implements OnInit {
    items: Item[] = [];
    
    selectedName = "";
    selectedId = "";
    selectedIcon = "";

    selectedItem?: Item;
    selectedType?: Type;

    linkType?: Type;

    

    override ngOnInit(): void {
      if (this.item) {
        let types = this.itemService.getTypes();
        let creatable_types = types.filter(t => this.collectTypeAttributes(t, {})['creatable'] === 'true');
        this.linkType = creatable_types.find(t => t.name === 'Link');
        if (this.linkType)
        {
          let query = new Query();
          query.myItems = true;
          if (this.item && this.item.attributes && 'creatable_types' in this.item.attributes) {
            const includedTypeNames: Set<string> = new Set(this.item.attributes['creatable_types']);
            const includedTypes:Type[] = [];
            for (let type of types) {
              for(let type_name of includedTypeNames) {
                if (isInstanceOf(type, type_name)) {
                  includedTypes.push(type);  
                  break;
                }
              }
            } 
            creatable_types = includedTypes;
          }
          query.types = creatable_types.map(c => c.name!);
          this.itemService.items(query).subscribe(items => {
              this.items = items;
              if (this.items.length > 0) {
                const i = this.items[0];
                //console.log(i);
                const icon = this.getItemIcon(i);
                if (i && i.name && i.id && this.linkType) {
                  this.selectedName = i.name;
                  this.selectedId = i.id;
                  this.selectedIcon = icon;
                  this.selectedItem = i;
                  this.selectedItem = new Item();
                  this.selectedItem.name = i.name + ' Link';
                  this.selectedItem.linked_item_id = i.id;
                  this.selectedItem.attributes = Object.assign({}, i.attributes? i.attributes : {});
                  this.selectedItem.type_id = this.linkType.id!;
                  this.selectedItem.type = this.linkType;
                  if(this.formGroup) {
                    this.formGroup.removeControl('linked_item_id');
                    this.formGroup.removeControl('type');
                    this.formGroup.addControl('linked_item_id', new FormControl(this.selectedId));
                    this.formGroup.addControl('type', new FormControl(this.linkType!.name!));
                    const nameControl = this.formGroup.controls['name'];
                    if (nameControl) {
                      this.formGroup.controls['name'].setValue(this.selectedItem.name);
                    }
                  }
                  console.log(this.selectedItem);
                  if (this.onEvent) {
                    this.onEvent.emit({event: "item", item: this.selectedItem, control: this.control});
                  }
                }
              }
          });
        }
      }
    }

    
    onSelectChange(event: MatSelectChange) {
      const e = this.items.filter(i => i.id === event.value)[0];
      const icon = this.getItemIcon(e);
      if (e && e.name && e.id && icon && this.linkType) {
        this.selectedId = e.id;
        this.selectedName = e.name;
        this.selectedIcon = icon;

        this.selectedItem = e;
        this.selectedItem = new Item();
        this.selectedItem.name = e.name + ' Link';
        this.selectedItem.linked_item_id = e.id;
        this.selectedItem.attributes = Object.assign({}, e.attributes? e.attributes : {});
        this.selectedItem.type_id = this.linkType.id!;
        this.selectedItem.type = this.linkType;

        if(this.formGroup) {
          this.formControl = new FormControl(this.selectedId);
            this.formGroup.removeControl('linked_item_id');
            this.formGroup.removeControl('type');
            this.formGroup.addControl('linked_item_id', new FormControl(this.selectedId));
            this.formGroup.addControl('type', new FormControl(this.linkType!.name!));
            const nameControl = this.formGroup.controls['name'];
            if (nameControl) {
              this.formGroup.controls['name'].setValue(this.selectedItem.name);
            }
        }

        //console.log(this.selectedItem);
        if (this.onEvent) {
          this.onEvent.emit({event: "item", item: this.selectedItem, control: this.control});
        }
      }
    }
}
