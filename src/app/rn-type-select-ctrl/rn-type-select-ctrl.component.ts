import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { RnCtrlComponent } from '../rn-ctrl/rn-ctrl.component';
import { isInstanceOf, Item, Type } from '../services/item.service';

@Component({
  selector: 'app-rn-type-select-ctrl',
  templateUrl: './rn-type-select-ctrl.component.html',
  styleUrls: ['./rn-type-select-ctrl.component.sass']
})
export class RnTypeSelectCtrlComponent  extends RnCtrlComponent implements OnInit {
  types: Type[] = [];

  selectedName = "";
  selectedId = "";
  selectedIcon = "";

  selectedItem?: Item;

  override ngOnInit(): void {
    const all_types: Type[] = this.itemService.getTypes();
    if(all_types) {
      const all_creatable_types = all_types.filter(t => this.collectTypeAttributes(t, {})['creatable'] === 'true');
      let attributes: {[index:string]:any} = {};
      if (this.item) {
        attributes = this.collectTypeAttributes(this.item.type!, attributes);
        if (this.item.attributes) {
          attributes = Object.assign(attributes, this.item.attributes);
        }
      }
      //console.log('item ', this.item, ' attributes ', attributes);
      if ('types' in attributes) {
          
          const includedTypeNames: Set<string> = new Set(attributes['types']);
          //console.log('************************* included type names ', includedTypeNames);
          //const includedTypes = new Set(types.filter(t => includedTypeNames.has(t.name)).map(t => t['id']));
          //this.types = this.types.filter(t => includedTypes.has(t['id']) || includedTypes.has(t['base_id']) );
          const includedTypes:Type[] = [];
          for (let type of all_creatable_types) {
            for(let type_name of includedTypeNames) {
              if (isInstanceOf(type, type_name)) {
                //console.log('************************* found instance ', type.name, 'of', type_name);
                includedTypes.push(type);  
                break;
              }
            }
          } 
          this.types = includedTypes;
          //console.log('************************* resulting types ', includedTypes);
      } else {
        // whitelist only from now
        // this.types = all_creatable_types;
      }
    }
  }

  activateType(t: Type) {
    const icon = this.getTypeIcon(t);
    if (t && t.name && t.id) {
      this.selectedIcon = icon;
      this.selectedName = t.name;
      this.selectedId = t.id;
      if(this.formGroup) {
        this.formGroup.removeControl('type');
        this.formGroup.addControl('type', new FormControl(this.selectedName));
        const nameControl = this.formGroup.controls['name'];
        if (nameControl) {
          this.formGroup.controls['name'].setValue(this.selectedName);
        }
      }
      this.selectedItem = new Item();
      this.selectedItem.name = 'New' + t.name;
      this.selectedItem.type_id = t.id;
      this.selectedItem.type = t;
      if(this.item && this.item.location) {
        this.selectedItem.location = this.item.location;
      }
      if (this.item && this.item.valid_from) {
        this.selectedItem.valid_from = this.item.valid_from;
      }
      if (this.item && this.item.valid_to) {
        this.selectedItem.valid_to = this.item.valid_to;
      }
      if (this.item && this.item.status) {
        this.selectedItem.status = this.item.status;
      }
      if (this.item && this.item.parent_id) {
        this.selectedItem.parent_id = this.item.parent_id;
      }
     
      this.selectedItem.attributes = this.collectTypeAttributes(t, {});

      if (this.item && this.item.attributes && 'host' in this.item.attributes) {
        this.selectedItem.attributes = Object.assign(this.selectedItem.attributes, {host: this.item.attributes['host']});
      }
      
     if (this.onEvent) {
        this.onEvent.emit({event: "type", item: this.selectedItem, control: this.control});
      }
    } else {
      console.log('skipped')
    }
  }

  ngAfterViewInit(): void {
    /*
    if (this.item) {
      if (this.item.type) {
        console.log('activate_type', this.item.type);
        this.activateType(this.item.type);
        return;
      }
    }*/
    if (this.types.length > 0) {
      this.activateType(this.types[0]);
    }
  }

    
  onSelectChange(event: MatSelectChange) {
      const e = this.types.filter(t => t.name === event.value)[0];
      this.activateType(e);
      /*
      const icon = this.getTypeIcon(e);
      if (e && e.name && e.id && icon) {
        this.selectedId = e.id;
        this.selectedName = e.name;
        this.selectedIcon = icon;

        this.selectedItem = new Item();
        this.selectedItem.name = 'New' + e.name;
        this.selectedItem.type_id = e.id;
        this.selectedItem.attributes = this.collectTypeAttributes(e, {});
        this.selectedItem.type = e;
        if(this.item && this.item.location) {
          this.selectedItem.location = this.item.location;
        }
        if (this.item && this.item.valid_from) {
          this.selectedItem.valid_from = this.item.valid_from;
        }
        if (this.item && this.item.valid_to) {
          this.selectedItem.valid_to = this.item.valid_to;
        }
        if (this.item && this.item.status) {
          this.selectedItem.status = this.item.status;
        }
        if (this.item && this.item.parent_id) {
          this.selectedItem.parent_id = this.item.parent_id;
        }
        
        if(this.formGroup) {
          //this.formGroup.removeControl('name');
          this.formGroup.removeControl('type');
          this.formGroup.addControl('type', new FormControl(this.selectedName));
          const nameControl = this.formGroup.controls['name'];
          if (nameControl) {
            this.formGroup.controls['name'].setValue(this.selectedItem.name);
          }
        }

        if (this.onEvent) {
          this.onEvent.emit({event: "type", item: this.selectedItem, control: this.control});
        }
      }
      */
  }

}
