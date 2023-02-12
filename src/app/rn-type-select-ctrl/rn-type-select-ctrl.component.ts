import { Component,  EventEmitter,  Input,  OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { RnCtrlComponent } from '../rn-ctrl/rn-ctrl.component';
import { isInstanceOf, Item, Type } from '../services/item.service';
import { OrderByPipe } from '../order-by.pipe';

@Component({
  selector: 'app-rn-type-select-ctrl',
  templateUrl: './rn-type-select-ctrl.component.html',
  styleUrls: ['./rn-type-select-ctrl.component.sass']
})
export class RnTypeSelectCtrlComponent  extends RnCtrlComponent implements OnInit {

  selectedName = "";
  selectedId = "";
  selectedIcon = "";

  selectedItem?: Item;
  initializing: boolean = true;

  @Input() activeType?: Type;

  @Output() selectedTypeChanged = new EventEmitter<Type>();
  @Output() initialTypeAssigned = new EventEmitter<Type>();

  override ngOnInit(): void {
    //console.log("*** type select on init ***");
    const all_types: Type[] = this.itemService.getTypes();
    const all_creatable_types = all_types.filter(t => this.collectTypeAttributes(t, {})['creatable'] !== 'false');
    if (this.types.length === 0) {
      if(all_types) {
        let attributes: {[index:string]:any} = {};
        if (this.item) {
          attributes = this.collectTypeAttributes(this.item.type!, attributes);
          if (this.item.attributes) {
            attributes = Object.assign(attributes, this.item.attributes);
          }
        }
        if (this.control) {
          const ctrl_attributes = this.collectItemAttributes(this.control, {});
          if('types' in ctrl_attributes && Object.keys(ctrl_attributes['types']).length > 0) {
            //console.logog('ctl_attrs:', ctrl_attributes['types'] );
            attributes['types'] = ctrl_attributes['types'];
          }
        }
        ////console.logog(this.item);
        ////console.logog('ctrl:', this.control);
        //console.logog('attributes', attributes);
        ////console.logog(this.types);
        ////console.logog(attributes);
        ////console.logog('item ', this.item, ' attributes ', attributes);
        if ('types' in attributes) {
            
            const includedTypeNames: Set<string> = new Set(attributes['types']);
            ////console.logog('************************* included type names ', includedTypeNames);
            //const includedTypes = new Set(types.filter(t => includedTypeNames.has(t.name)).map(t => t['id']));
            //this.types = this.types.filter(t => includedTypes.has(t['id']) || includedTypes.has(t['base_id']) );
            const includedTypes:Type[] = [];
            for (let type of all_creatable_types) {
              for(let type_name of includedTypeNames) {
                if (isInstanceOf(type, type_name)) {
                  ////console.logog('************************* found instance ', type.name, 'of', type_name);
                  includedTypes.push(type);  
                  break;
                }
              }
            } 
            this.types = includedTypes;
            ////console.logog('************************* resulting types ', includedTypes);
        } else {
          // whitelist only from now
          // this.types = all_creatable_types;
          //console.logog(this.item);
        }
      }
    } else {
      const includedTypes:Type[] = [];
      for (let type of all_creatable_types) {
        for(let included_type of this.types) {
          if (isInstanceOf(type, included_type.name!)) {
            includedTypes.push(type);  
          }  
        }
      } 
      this.types = includedTypes;
    }
    
    //this.activateType(this.types[0]);
    /*
    if (!this.activeType && this.types.length > 0) {
      this.activeType = this.types[0];
    }*/
  }

  activateType(t: Type) {
    
    const icon = this.getTypeIcon(t);
    if (t && t.name && t.id) {
      //console.log('*** activating type:', t.name);
      
      //this.activeType = t;
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
    } else {
      //console.logog('skipped')
    }
  }

  ngAfterViewInit(): void {
    //console.log("*** type select after view init ***");
    
    /*
    if (this.item) {
      if (this.item.type) {
        //console.logog('activate_type', this.item.type);
        this.activateType(this.item.type);
        return;
      }
    }*/
    ////console.logog('*** after_View_init at:',this.activeType);
    
    if (this.activeType) {
      this.activateType(this.activeType);
      this.initializing = false;
      if (this.initialTypeAssigned) {
        ////console.logog("*** type select control emitting onType:",t);
        ////console.log(this.onType);
        this.initialTypeAssigned.emit(this.activeType);
      }
    }
  }

    
  onSelectChange(event: MatSelectChange) {
      const e = this.types.filter(t => t.name === event.value)[0];
      //console.logog('*** select_change:',e);
      this.activateType(e);
      //this.initializing = false;
      if (this.selectedTypeChanged) {
        ////console.logog("*** type select control emitting onType:",t);
        ////console.logog(this.onType);
        this.selectedTypeChanged.emit(e);
      }
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
