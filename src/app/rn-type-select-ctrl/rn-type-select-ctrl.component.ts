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
    //console.log(this.item);
    this.itemService.types().subscribe(types => {
      if(types) {
        this.types = types.filter(t => t.attributes && t.attributes['creatable'] === 'true');
        if (this.item && this.item.attributes && 'creatable_types' in this.item.attributes) {
            const includedTypeNames: Set<string> = new Set(this.item.attributes['creatable_types']);
            //console.log('************************* included type names ', includedTypeNames);
            //const includedTypes = new Set(types.filter(t => includedTypeNames.has(t.name)).map(t => t['id']));
            //this.types = this.types.filter(t => includedTypes.has(t['id']) || includedTypes.has(t['base_id']) );
            const includedTypes:Type[] = [];
            for (let type of this.types) {
              for(let type_name of includedTypeNames) {
                if (isInstanceOf(type, type_name)) {
                  //console.log('************************* found instance ', type.name, type_name);
                  includedTypes.push(type);  
                  break;
                }
              }
            } 
            this.types = includedTypes;
            //console.log('************************* resulting types ', includedTypes);
        }
        
        if (this.types.length > 0) {
          const t = this.types[0];
          if (t && t.name && t.id && t.icon) {
            this.selectedName = t.name;
            this.selectedId = t.id;
            this.selectedIcon = t.icon;
            if(this.formGroup) {
              if(this.control && this.control.name) {
                this.formControl = new FormControl(this.selectedName);
                this.formGroup.addControl('type', this.formControl);
              }
            }
            this.selectedItem = new Item();
            this.selectedItem.name = 'New' + t.name;
            this.selectedItem.type_id = t.id;
            this.selectedItem.attributes = t.attributes;
            if (this.onEvent) {
              this.onEvent.emit({event: "item", item: this.selectedItem, control: this.control});
            }
          }
        }
      }
    });
  }
    
  onSelectChange(event: MatSelectChange) {
      const e = this.types.filter(t => t.name === event.value)[0];
      if (e && e.name && e.id && e.icon) {
        this.selectedId = e.id;
        this.selectedName = e.name;
        this.selectedIcon = e.icon;

        this.selectedItem = new Item();
        this.selectedItem.name = 'New' + e.name;
        this.selectedItem.type_id = e.id;
        this.selectedItem.attributes = e.attributes;
        //console.log(this.selectedItem);
        if (this.onEvent) {
          this.onEvent.emit({event: "item", item: this.selectedItem, control: this.control});
        }
      }
  }

}
