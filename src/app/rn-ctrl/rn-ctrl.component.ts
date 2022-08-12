import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { RnDialogComponent } from '../rn-dialog/rn-dialog.component';
import { SecurePipe6 } from '../secure-pipe';
import { AuthService } from '../services/auth.service';
import { Instance, Item, ItemEvent, itemIsInstanceOf, ItemService, MenuItem, Query, Type } from '../services/item.service';
import { RendererService } from '../services/renderer.service';
import { SessionService } from '../services/session.service';

export interface ItemCallbacks {
  itemsChanged(items?: Item[]): void
}

@Component({
  selector: 'app-rn-ctrl',
  templateUrl: './rn-ctrl.component.html',
  styleUrls: ['./rn-ctrl.component.sass']
})
export class RnCtrlComponent implements OnInit, OnChanges, ItemCallbacks {
  @Input() item?: Item;
  @Input() control?: Item;
  @Input() controls: Item[] = [];
  @Input() formGroup?: FormGroup;
  @Input() fieldName?: string;
  @Input() tabIndex?: number;
  @Input() layout?: string = "column";
  @Input() align?: string = "center center";
  @Input() gap?: string = "1%";
  @Input() events?: Observable<ItemEvent>;
  @Output() onEvent = new EventEmitter<ItemEvent>();
  @Output() onEvents = new EventEmitter<ItemEvent>();
  
  @Output() onRefresh = new EventEmitter();
  @Output() onItems = new EventEmitter<Item[]>();
  
  formControl = new FormControl('');
  
  constructor(protected itemService: ItemService,
              protected authService: AuthService,
              protected sessionService: SessionService,
              protected rendererService: RendererService,
              protected sanitizer: DomSanitizer,
              protected route: ActivatedRoute,
              protected dialog: MatDialog,
              protected snackBar: MatSnackBar,
              public viewContainerRef: ViewContainerRef,
              protected securePipe6: SecurePipe6) { }

  ngOnInit(): void {
    ////console.log(this);
    ////console.log(this.formGroup)
    if(!this.item) {
      this.item = this.control;
    }

    if(this.control) {
      this.controls = this.getItemControls(this.control);

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

      let field_name = this.fieldName? this.fieldName.toLowerCase() : this.getAttribute(this.control, 'field_name', '').toLowerCase();
      ////console.log(field_name);
      if(field_name === '' && this.control && this.control.name) {
        field_name = this.control.name.toLowerCase();
      }
      if (field_name === 'tags' || field_name === 'types') {
        this.formControl = new FormControl([]);
      } else {
        //const val = this.getValue();
        ////console.log(val);
        this.formControl = new FormControl(this.getValue());
      }
      
      if(this.formGroup) {
        ////console.log(this.control);
        this.formGroup.addControl(field_name, this.formControl);
      }

      
      ////console.log(field_name, this.formControl);
    }
    
    this.initialize();
  }

  protected initialize() {}

  getItemIcon(item: Item) : string {
    return this.itemService.getItemIcon(item);
  }

  getTypeIcon(type: Type) : string {
    return this.itemService.getTypeIcon(type);
  }

  collectTypeAttributes(type: Type, attrs: {[index: string]:any}) {
    return this.itemService.collectTypeAttributes(type, attrs);
  }

  collectItemAttributes(item: Item, attrs: {[index: string]:any}) {
    return this.itemService.collectItemAttributes(item, attrs);
  }

  getItemTypes(item: Item): Type[] {
    const attributes = this.itemService.collectItemAttributes(item, {});
    if ('types' in attributes) {
      const names = new Set(attributes['types']);
      const types = this.itemService.getTypes().filter(t => names.has(t.name));
      return types;
    }
    return []
  }

  buildItemInstance(instance: Instance): Item {
    const item = new Item();
    if (instance.type) {
      if(instance.type.instances) {
        item.items = []
        instance.type.instances.forEach(i => {
          item.items!.push(this.buildItemInstance(i));
        });
      }
      item.type = instance.type;
      item.name = instance.name
      item.attributes = instance.attributes;
    }
    return item;
  }

  buildItem(type: Type, name?: string, attributes?: {[index: string]: any} ): Item {
    const item = new Item();
    
    item.type = type;

    if(type.instances) {
      item.items = []
      type.instances.forEach(i => {
        item.items!.push(this.buildItemInstance(i));
      });
    }
    item.name = type.name
    item.attributes = type.attributes
    if (attributes) {
      item.attributes = Object.assign(item.attributes? item.attributes : {}, attributes);
    }
    if (name) {
      item.name = name
    }
    return item;
  }

  getItemControls(item: Item): Item[] {
    const attributes = this.itemService.collectItemAttributes(item, {});
    if ('controls' in attributes) {
      const ctrls = attributes['controls'].map((v:any) => {
        let item: Item = new Item();
        const type = this.itemService.getTypes().find(t => t.name === v['type']);
        if (type) {
          item = this.buildItem(type, v['name'], v['attributes'] );
          ////console.log('parsing_ctrl',v, type, item);
        }
        return item;
      });
      ////console.log(ctrls);
      return ctrls;
    }
    return []
  }

  getControlType(type: Type): string {
    if (type.name && type.name.endsWith('Ctrl')) {
      ////console.log('found control type ', type.name);
      return type.name;
    }
    if (type && type.base) {
      ////console.log('checking base ',type.base);
      return this.getControlType(type.base);
    }
    ////console.log('not a control type ',type);
    return 'Ctrl';
  }

  getViewType(type: Type): string {
    ////console.log(type);
    if (type.name && type.name.endsWith('View')) {
      ////console.log('found view type ', type.name);
      return type.name;
    }
    if (type && type.base) {
      ////console.log('checking base ',type.base);
      return this.getViewType(type.base);
    }
    ////console.log('not a view type ',type);
    return 'View';
  }

  getItemMenuItems(item: Item): MenuItem[] {
    const attributes = this.itemService.collectItemAttributes(item, {});
    if ('menu' in attributes) {
      return attributes['menu'];
    }
    return [];
  }

  presentForm(formName: string) {
    const forms = this.itemService.getForms();
    ////console.log(dialogs);
    if (forms) {
      const form = forms.filter(d => d.name === formName);
      //console.log(form);
      if (form) {
        //console.log(target_item);
        this.dialog.open(RnDialogComponent, {
          width: '95vw',
          height: '75vh',
          data: {view: form[0] }
        });
      }
    }
  }

  getItemViews(item: Item): Item[] {
    const attributes = this.itemService.collectItemAttributes(item, {});
    if ('views' in attributes) {
      return attributes['views'].map((v:any) => {
        let item: Item = new Item();
        const type = this.itemService.getTypes().find(t => t.name === v['type']);
        if (type) {
            item = this.buildItem(type, v['name'], v['attributes'] );
        }
        if('query' in v) {
          item.attributes = Object.assign(item.attributes? item.attributes : {}, {query: v['query']});
        }
        return item;
      });
    }
    return []
  }

  public getAttribute(item: Item, key: string, def: string): string {
    const attributes = this.collectTypeAttributes(item.type!, item.attributes? item.attributes : {});
    if(attributes) {
      const ret = attributes[key];
      if (ret) {
        return ret;
      }
    } 

    return def;
  }

  getValue() {
    if (this.control) {
      const control_attributes = this.collectItemAttributes(this.control, {});
      if ('value' in control_attributes) {
        return control_attributes['value'];
      }
      
      if (this.item) {
        //console.log(this.item);
        const item_attributes = this.collectItemAttributes(this.item, {});
        if (item_attributes && control_attributes) {

          if ('target' in control_attributes) {
            const key = control_attributes['target'];
            if (key) {
              //console.log(key);
              let namespace = control_attributes['namespace'];
              if (namespace) {
                //console.log(namespace);
                if (namespace === 'attributes') {
                  let attrs = this.item.attributes? this.item.attributes : {};
                  return attrs[key];
                } else {
                  const namespace_parts = namespace.split('.');
                
                  let attrs = this.item.attributes? this.item.attributes : {};
                
                  let target_dict = attrs;
                  if(namespace_parts) {
                    namespace_parts.forEach((np: string) => {
                      if(np in target_dict) {
                        target_dict = target_dict[np];
                      } else {
                        target_dict[np] = {};
                        target_dict = target_dict[np];
                      } 
                    });
                  return target_dict[key];
                  }
                
                }
              } else {
                  if (key === "valid_from") {
                    return this.item.valid_from;
                  } else if (key === "valid_to") {
                    return this.item.valid_to;
                  } else if (key === "name") {
                    return this.item.name;
                  } else if (key === "location") {
                    return this.item.location;
                  } else if (key === "status") {
                    return this.item.status;
                  } else if (key === "parent_id") {
                    return this.item.parent_id;
                  }
              }
            }
            
          }
        }
      }
    }
  }

  setItemAttribute(item: Item, key: string, value: any) {
    if (item.attributes) {
      item.attributes[key] = value;
    } else {
      item.attributes = { key: value};
    }
  }

  setValue(value: any) {
    if (this.control && this.item) {
      const control_attributes = this.collectItemAttributes(this.control, {});
      //console.log('** item before', this.item);
      if ('target' in control_attributes) {
        const key = control_attributes['target'];
        //console.log(key);
        if (key) {
          //console.log(control_attributes);
          let namespace = control_attributes['namespace'];
          if (namespace) {
            if (namespace === 'attributes') {
              let attrs = this.item.attributes? this.item.attributes : {};
              attrs[key] = value;
            } else {
              ////console.log(namespace);
              const namespace_parts = namespace.split('.');
              ////console.log(namespace_parts);
              let attrs = this.item.attributes? this.item.attributes : {};
              
                let target_dict = attrs;
                if(namespace_parts) {
                  
                  namespace_parts.forEach((np: string, index: number) => {
                    //console.log(np);
                    if(!(np === 'attributes' && index === 0)) {
                      if(np in target_dict) {
                        target_dict = target_dict[np];
                      } else {
                        target_dict[np] = {};
                        target_dict = target_dict[np];
                      }
                    }
                    
                  });
                target_dict[key] = value;
              }
            } 
          } else {
            if (key === "valid_from") {
              this.item.valid_from = value;
            } else if (key === "valid_to") {
              this.item.valid_to = value;
            } else if (key === "name") {
              this.item.name = value;
            } else if (key === "location") {
              this.item.location = JSON.parse(value);
            } else if (key === "status") {
              this.item.status = value;
            } else if (key === "parent_id") {
              this.item.parent_id = value;
            }
        }
        }
        
      }
      //console.log('** item after', this.item);
    }
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

  isAccordion(item: Item) {
    return itemIsInstanceOf(item, "AccordionCtrl");
  }

  isSteps(item: Item) {
    return itemIsInstanceOf(item, "StepsCtrl");
  }

  isTabs(item: Item) {
    return itemIsInstanceOf(item, "TabsCtrl");
  }

  isView(item: Item) {
    return itemIsInstanceOf(item, "View");
  }

  childRefresh() {
    if (this.onRefresh) {
      this.onRefresh.emit();
    }
  }

  childItems(items: Item[]) {
    //console.log('*** child items ***', this);
    if (this.onItems) {
      this.onItems.emit(items);
    }
  }

  itemFromQuery(query: Query): Item {
    const result = new Item();
    const types = this.itemService.getTypes()
    if (types) {
      let type = types.find(t => t.name === 'Query');
      if (type) {
        result.type = type;
      }
    }
    if (query.name) {
      result.name = query.name;
    }
    if(query.types) {
      result.attributes = {types: query.types};
    }
    if(query.location) {
      result.location = query.location;
    }
    if(query.tags) {
      result.tags = query.tags;
    }
    if(query.valid_from) {
      result.valid_from = query.valid_from;
    }
    if(query.valid_to) {
      result.valid_to = query.valid_to;
    }
    if(query.status) {
      result.status = query.status;
    }
    return result;
  }

  queryFromItem(item: Item): Query {
    const result = new Query();
    if (item.name) {
      result.name = item.name;
    }
    if(item.attributes) {
      if ('types' in item.attributes) {
        result.types = item.attributes['types'];
      }
    }
    if(item.location) {
      result.location = item.location;
    }
    if(item.tags) {
      result.tags = item.tags;
    }
    if(item.valid_from) {
      result.valid_from = item.valid_from;
    }
    if(item.valid_to) {
      result.valid_to = item.valid_to;
    }
    if(item.status) {
      result.status = item.status;
    }
    return result;
  }

  getUpdateParams2(data: {[index: string]: any}, add_parent=false) {
    //console.log("&&& getUpdateParams2 &&&", data, this.item);
    const params: {[index: string]: any} = {};
    let attrs = data['attributes'];
    if (attrs) {
      params['attributes'] = attrs;
    } else {
      params['attributes'] = {};
      attrs = params['attributes'];
    }
    
    if ('type' in data) {
      if (Object.prototype.toString.call(data['type']) === "[object String]") {
        params['type'] =data['type']
      }
    }
    if('name' in data) {
      //console.log('1');
      const name = data['name'];
      if(!(!name || name.trim() === "" || (name.trim()).length === 0)) {
        //console.log('2');
        params['name'] = data['name'];
      } 
    } else if ('name' in attrs) {
        //console.log('3');
        //console.log(attrs);
        const name = attrs['name'];
        //console.log(name);
        if(!(!name || name.trim() === "" || (name.trim()).length === 0)) {
          //console.log('4');
          params['name'] = attrs['name'];
        }
        delete attrs['name'];
    }
    if ('parent_id' in data && data['parent_id']) {
      params['parent_id'] = data['parent_id']
    } else if (add_parent && this.item && !itemIsInstanceOf(this.item, 'App')) {
      params['parent_id'] = this.item.id
    }
    if ('types' in data && !!data['types']) {
      attrs['types'] = data['types'];
    }
    if ('tags' in data && !!data['tags']) {
      params['tags'] = data['tags'];
    }
    if ('location' in data && !!data['location']) {
      params['location'] = data['location'];
    }
    if ('valid_from' in data  && data['valid_from'] !== undefined) {
      params['valid_from'] = new Date(data['valid_from']).toISOString();
    }
    if ('valid_to' in data && data['valid_to'] !== undefined) {
      params['valid_to'] = new Date(data['valid_to']).toISOString();
    }
    if ('status' in data && data['status'] !== undefined) {
      params['status'] = data['status'];
    }
    if('types' in data) {
      attrs['types'] = data['types'];
    }
    //console.log(params);
    return params;
  }

  getUpdateParams(data: {[index: string]: any}, add_parent=false) {
    //console.log("&&& getUpdateParams &&&", data);
    const params: {[index: string]: any} = {};
    let attrs = data['attributes'];
    if (attrs) {
      params['attributes'] = attrs;
    } else {
      params['attributes'] = {};
      attrs = params['attributes'];
    }
    
    if ('type' in data) {
      if (Object.prototype.toString.call(data['type']) === "[object String]") {
        params['type'] =data['type']
      }
    }
    if ('name' in attrs) {
        params['name'] = attrs['name'];
        delete attrs['name'];
    } else if('name' in data) {
      params['name'] = data['name'];
    }
    if ('parent_id' in data && data['parent_id']) {
      params['parent_id'] = data['parent_id']
    } else if (add_parent && this.item && !itemIsInstanceOf(this.item, 'App')) {
      params['parent_id'] = this.item.id
    }
    if ('location' in data && !! data['location']) {
      params['location'] = data['location'];
    }
    if ('valid_from' in data) {
      params['valid_from'] = data['valid_from'];
    }
    if ('valid_to' in data) {
      params['valid_to'] = data['valid_to'];
    }
    if ('status' in data) {
      params['status'] = data['status'];
    }
    if('types' in data) {
      attrs['types'] = data['types'];
    }

    return params;
  }

  getItemQuery(item: Item): Query | undefined {
    const attributes = this.itemService.collectItemAttributes(item, {});
    //console.log(item, attributes);
    if ('query' in attributes && Object.keys(attributes['query']).length > 0) {
      let query: Query = new Query();
      query = {... attributes['query']};
      return query;
    }
    return undefined;
  }

  controlChanged(control?: Item) {
    ////console.log('*************************************** hello from control control changed!!!');
  }

  itemChanged(item?: Item) {
    ////console.log('*************************************** hello from control item changed!!!');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['control']) {
     this.controlChanged(this.control);
    } else if(changes['item']) {
      this.itemChanged(this.item);
    }
  }

  itemsChanged(items?: Item[]): void {
    ////console.log('*************************************** hello from control items changed!!!', this.control!.type!.name!);
  }

  onEventHandler(event: ItemEvent) {
    //console.log(event, this);
    if (event.event) {
      if (event.event === 'item') {
        this.refreshValue(event);
        //this.controls.forEach(c => c.refreshValue())
        //this.rebuildControls();
      } else if(event.event === 'type') {
        ////console.log(this);
        this.item = event.item;
        this.refreshValue(event);
        //this.form_group.setValue(this.item!);
        ////console.log(this.form_group);
        //this.rebuildControls();
      }
    }
    this.onEvent.next(event);
  }

  refreshValue(event: ItemEvent) {
    ////console.log('*************************************** hello from control refresh value!!!');
  }

}
