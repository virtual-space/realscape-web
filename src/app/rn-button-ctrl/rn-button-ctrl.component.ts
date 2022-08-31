import { Component, OnInit } from '@angular/core';
import { RnCtrlComponent } from '../rn-ctrl/rn-ctrl.component';
import { Item, itemIsInstanceOf, Query } from '../services/item.service';

@Component({
  selector: 'app-rn-button-ctrl',
  templateUrl: './rn-button-ctrl.component.html',
  styleUrls: ['./rn-button-ctrl.component.sass']
})
export class RnButtonCtrlComponent extends RnCtrlComponent implements OnInit {

  public onClick(event: Event) {
    //console.log(event);
    ////console.log(this.formGroup!.value)
    if (this.item) {
      if (this.control) {
        const attrs = this.collectItemAttributes(this.control, {});
        ////console.log(attrs);
        if ('command' in attrs) {
          const command = attrs['command'];
          if (command === "Save") {
            //console.log("*** save_item ***", this.item);
            if (this.item && this.formGroup) {
              let target_id = this.item!.id!;
              let result = this.formGroup.value;
              if (result) {
                //console.log(result);
                if (itemIsInstanceOf(this.item, "View")) {
                  ////console.log('*** is_view');
                  if ('host' in result.attributes) {
                    const host: Item = result.attributes['host'];
                    ////console.log('host: ', host);
                    const item_name = this.item.name;
                    const item_type_name = this.item.type!.name
                    let views = this.getItemViews(host).map(v => { return {name: v.name, type: v.type!.name, attributes: v.attributes}});
                    const view = views.find(v => v.name === item_name && v.type === item_type_name);
                    if(view) {
                      view.name = result.name;
                      //view.type = result.item.type.name;
                      delete result.attributes['host'];
                      view.attributes = {...result.attributes};
                    } else {
                      views.push({name: result.name, type: item_type_name, attributes: {}})
                    }
                    result = {attributes: Object.assign(host.attributes? host.attributes : {}, {views: views})};
                    target_id = host['id']!;
                    ////console.log('result and target_id',result, target_id);
                  }
                  
                }  else if (itemIsInstanceOf(this.item, "Query")) {
                   //console.log('*** is_query');
                  if ('host' in result.attributes) {
                    const host: Item = result.attributes['host'];
                    //console.log('host', host);
                    //console.log('result', result);
                    let result_item: Item = {...result};
                    if ('types' in result) {
                      result_item.attributes = Object.assign(result_item.attributes? result_item.attributes : {}, {types: result['types']});
                    }
                    result = {attributes: Object.assign(host.attributes? host.attributes : {}, {query: this.queryFromItem(result_item)})};
                    target_id = host['id']!;
                    ////console.log('result and target_id',result, target_id);
                  }
                }
                 else {
                  result = this.getUpdateParams2(this.formGroup!.value);
                }

                this.itemService.update(target_id, result).subscribe(item => {
                  ////console.log('updated item', item);
                  this.sessionService.activateItem(item);
                });
                
              }
            }
            
            
            
            /*let views = this.getItemViews(this.item!).map(v => { return {name: v.name, type: v.type!.name, attributes: v.attributes}});
            const view = views.find(v => v.name === item.name && v.type === item.type!.name!);
            ////console.log(view);
            if(view) {
              view.name = result.data.name;
              view.type = result.item.type.name;
              view.attributes = result.data.attributes;
            }
            let attr_data = Object.assign(this.item!.attributes, {views: views})
            */
           /*
            this.itemService.update(this.item!.id!, this.getUpdateParams2(this.formGroup!.value)).subscribe(item => {
              this.sessionService.activateItem(item);
            });
            */
        } else if (command === "Create") {
          //console.log("*** create_item ***", this.formGroup!.value);
          //console.log(this.item);
          if (this.item && this.formGroup) {
            let target_id = this.item!.id!;
            let result = this.formGroup.value;
            if (result) {
              ////console.log(result);
              ////console.log(this.item);
              if (itemIsInstanceOf(this.item, "View")) {
                ////console.log('*** is_view');
                if ('host' in result.attributes) {
                  const host: Item = result.attributes['host'];
                  ////console.log('host: ', host);
                  const item_name = this.item.name;
                  const item_type_name = this.item.type!.name
                  let views = this.getItemViews(host).map(v => { return {name: v.name, type: v.type!.name, attributes: v.attributes}});
                  const view = views.find(v => v.name === item_name && v.type === item_type_name);
                  views.push({name: result.name, type: item_type_name, attributes: {}});
                  result = {attributes: Object.assign(host.attributes? host.attributes : {}, {views: views})};
                  target_id = host['id']!;
                  ////console.log(result,target_id);
                  this.itemService.update(target_id, result).subscribe(item => {
                    ////console.log('updated item', item);
                    this.sessionService.activateItem(item);
                  });

                }
                
              } else {
                result = this.getUpdateParams2(this.formGroup!.value,false);
                if (!('type' in result)) {
                  if ('type' in this.item.attributes!) {
                    result['type'] = this.item.attributes!['type'];
                  }
                }
                this.itemService.create(result).subscribe(item => {
                  ////console.log('updated item', JSON.stringify(item));
                  this.sessionService.activateItem(item);
                });
              }
              //result = this.getUpdateParams2(this.formGroup!.value,true);
              
            }
          }
        } else if (command === "Invoke") {
          console.log("*** invoke_item ***", this.formGroup!.value);
          console.log(this.item);
          if (this.item && this.formGroup) {
            let target_id = this.item!.id!;
            let result = this.formGroup.value;
            if (result) {
              console.log(result);
              if (this.item.location) {
                if ('location' in result === false) {
                    result.location = JSON.stringify(this.item.location);
                }
              }
              ////console.log(this.item);
              //console.log(this.control);
              //console.log(this.formItem);
              let attrs = this.collectItemAttributes(this.item, {});

              if (this.formItem) {
                attrs = this.collectItemAttributes(this.formItem, attrs);
              } else if(this.control) {
                attrs = this.collectItemAttributes(this.control, attrs);
              }
              //console.log(attrs);
              //result = this.getUpdateParams2(this.formGroup!.value,false);
              result = Object.assign(this.formGroup!.value, {});
              if (!('type' in result)) {
                if ('type' in this.item.attributes!) {
                  result['type'] = this.item.attributes!['type'];
                }
              }

              let includeParent = true;
              let includeId = false;

              if ('edit' in attrs && attrs['edit'] === 'true') {
                  includeParent = false;
                  includeId = true;
              } else if(itemIsInstanceOf(this.item, 'App')) {
                includeParent = 'my_items' in attrs && attrs['my_items'] === 'true';
              }

              //console.log('includeParent, includeId:', includeParent, includeId);

              if(includeParent) {
                result['parent_id'] = this.item.id;
              }
              if(includeId) {
                result['id'] = this.item.id;
              }

              this.itemService.invoke(attrs['path'], attrs['method'], result).subscribe(item => {
                ////console.log('updated item', JSON.stringify(item));
                this.sessionService.activateItem(item);
              });
              //result = this.getUpdateParams2(this.formGroup!.value,true);
              
            }
          }
        } else if (command === "Find") {
          ////console.log("*** find_item ***", this.formGroup!.value);
          this.itemService.items(this.queryFromItem(this.getUpdateParams2(this.formGroup!.value))).subscribe(items => {
            this.sessionService.activateItems(items);
          });
        } else if (command === "Reset") {
          /*
          if (this.onRefresh) {
            this.onRefresh.emit();
          }*/
          ////console.log("*** reset_item ***");
          if (this.item) {
            this.sessionService.activateItem(this.item);
          } else {
            this.sessionService.activateItem(new Item());
          }
        } else if (command === "Delete") {
          ////console.log("*** delete_item ***");
        } else {
          ////console.log("*** unknown ***");
        }
        }
      }
    }
  }
}
