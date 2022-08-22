import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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

    @Input() activeItem?: Item;

    @Output() selectedItemChanged = new EventEmitter<Item>();

    override ngOnInit(): void {
      console.log('select', this);
      if (this.item) {
        const itemQuery = this.getItemQuery(this.item);
        console.log(this.item);
        if (itemQuery) {
          const query = itemQuery? itemQuery : new Query();
          console.log(query);
          query.types = query.parent_types;
          this.itemService.items(query).subscribe(items => {
            this.items = items;
            if (this.items.length > 0) {
              const value = this.getValue();
              if(value !== undefined) {
                const i = this.items.find(ii => ii.id === value);
                if (i) {
                  const icon = this.getItemIcon(i);
                  const field_name = this.getFieldName();
                  if (i && i.name && i.id && this.linkType) {
                    this.selectedName = i.name;
                    this.selectedId = i.id;
                    this.selectedIcon = icon;
                    this.selectedItem = i;
                    if(this.formGroup) {
                      this.formControl = new FormControl(this.selectedId);
                      this.formGroup.removeControl(field_name);
                      this.formGroup.addControl(field_name, this.formControl);
                    }
                    console.log(this.selectedItem);
                    if (this.onEvent) {
                      this.onEvent.emit({event: field_name, item: this.selectedItem, control: this.control});
                    }
                  }
                }
              } else {
                const i = this.items[0];
                const icon = this.getItemIcon(i);
                const field_name = this.getFieldName();
                if (i && i.name && i.id) {
                  this.selectedName = i.name;
                  this.selectedId = i.id;
                  this.selectedIcon = icon;
                  this.selectedItem = i;
                  if(this.formGroup) {
                    this.formControl = new FormControl(this.selectedId);
                    this.formGroup.removeControl(field_name);
                    this.formGroup.addControl(field_name, this.formControl);
                  }
                  console.log(this.selectedItem);
                  if (this.onEvent) {
                    this.onEvent.emit({event: field_name, item: this.selectedItem, control: this.control});
                  }
                }
                
              }
              
            }
          });
        } else {
          const value = this.getValue();
         
          //console.log('*** field_name, value, control ***', field_name, value, this.control);
          if (value !== undefined) {
            this.itemService.getItem(value).subscribe(item => {
              this.items = [item];
              this.selectedName = item.name!;
              this.selectedId = item.id!;
              this.selectedIcon = this.getItemIcon(item);
              this.selectedItem = item;
              const field_name = this.getFieldName();
              if(this.formGroup) {
                this.formControl = new FormControl(this.selectedId);
                this.formGroup.removeControl(field_name);
                this.formGroup.addControl(field_name, this.formControl);
              }
            });
          }
          
        }
        
      }
    }

    getItems(): string {
      return this.getControlAttribute('suffix', '', this.control);
    }

    getSuffix(): string {
      return this.getControlAttribute('suffix', '', this.control);
    }

    getFieldName(): string {
      console.log('get_field_name:',this.control);
      return this.getControlAttribute('field_name', '', this.control);
    }

    getTarget(): string {
      return this.getControlAttribute('target', '', this.control);
    }

    
    onSelectChange(event: MatSelectChange) {
      const e = this.items.filter(i => i.id === event.value)[0];
      const icon = this.getItemIcon(e);
      if (e && e.name && e.id && icon) {
        this.selectedId = e.id;
        this.selectedName = e.name;
        this.selectedIcon = icon;
        this.selectedItem = e;

        const field_name = this.getFieldName();

        if(this.formGroup) {
          this.formControl = new FormControl(this.selectedId);
          this.formGroup.removeControl(field_name);
          this.formGroup.addControl(field_name, this.formControl);
        }

        if (this.selectedItemChanged) {
          //console.log("*** type select control emitting onType:",t);
          //console.log(this.onType);
          this.selectedItemChanged.emit(e);
        }

        //console.log(this.selectedItem);
        if (this.onEvent) {
          this.onEvent.emit({event: field_name, item: this.selectedItem, control: this.control});
        }
      }
    }
}
