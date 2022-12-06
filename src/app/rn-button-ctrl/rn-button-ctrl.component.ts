import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RnCtrlComponent } from '../rn-ctrl/rn-ctrl.component';
import { Item, itemIsInstanceOf, Query } from '../services/item.service';

@Component({
  selector: 'app-rn-button-ctrl',
  templateUrl: './rn-button-ctrl.component.html',
  styleUrls: ['./rn-button-ctrl.component.sass']
})
export class RnButtonCtrlComponent extends RnCtrlComponent implements OnInit {

  @ViewChild('uploader') uploader!: ElementRef;

  public onClick(event: Event) {
    //console.log(event);
    ////////console.logthis.formGroup!.value)
    if (this.item) {
      if (this.control) {
        const attrs = this.collectItemAttributes(this.control, {});
        console.log(attrs);
        if ('command' in attrs) {
          const command = attrs['command'];
          if (command === "Save") {
            //////console.log"*** save_item ***", this.item);
            if (this.item && this.formGroup) {
              let target_id = this.item!.id!;
              let result = this.formGroup.value;
              if (result) {
                //////console.logresult);
                if (itemIsInstanceOf(this.item, "View")) {
                  ////////console.log'*** is_view');
                  if ('host' in result.attributes) {
                    const host: Item = result.attributes['host'];
                    ////////console.log'host: ', host);
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
                    ////////console.log'result and target_id',result, target_id);
                  }
                  
                }  else if (itemIsInstanceOf(this.item, "Query")) {
                   //////console.log'*** is_query');
                  if ('host' in result.attributes) {
                    const host: Item = result.attributes['host'];
                    //////console.log'host', host);
                    //////console.log'result', result);
                    let result_item: Item = {...result};
                    if ('types' in result) {
                      result_item.attributes = Object.assign(result_item.attributes? result_item.attributes : {}, {types: result['types']});
                    }
                    result = {attributes: Object.assign(host.attributes? host.attributes : {}, {query: this.queryFromItem(result_item)})};
                    target_id = host['id']!;
                    ////////console.log'result and target_id',result, target_id);
                  }
                }
                 else {
                  result = this.getUpdateParams2(this.formGroup!.value);
                }

                this.itemService.update(target_id, result).subscribe(item => {
                  ////////console.log'updated item', item);
                  this.sessionService.activateItem(item);
                });
                
              }
            }
            
            
            
            /*let views = this.getItemViews(this.item!).map(v => { return {name: v.name, type: v.type!.name, attributes: v.attributes}});
            const view = views.find(v => v.name === item.name && v.type === item.type!.name!);
            ////////console.logview);
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
          //////console.log"*** create_item ***", this.formGroup!.value);
          //////console.logthis.item);
          if (this.item && this.formGroup) {
            let target_id = this.item!.id!;
            let result = this.formGroup.value;
            if (result) {
              ////////console.logresult);
              ////////console.logthis.item);
              if (itemIsInstanceOf(this.item, "View")) {
                ////////console.log'*** is_view');
                if ('host' in result.attributes) {
                  const host: Item = result.attributes['host'];
                  ////////console.log'host: ', host);
                  const item_name = this.item.name;
                  const item_type_name = this.item.type!.name
                  let views = this.getItemViews(host).map(v => { return {name: v.name, type: v.type!.name, attributes: v.attributes}});
                  const view = views.find(v => v.name === item_name && v.type === item_type_name);
                  views.push({name: result.name, type: item_type_name, attributes: {}});
                  result = {attributes: Object.assign(host.attributes? host.attributes : {}, {views: views})};
                  target_id = host['id']!;
                  ////////console.logresult,target_id);
                  this.itemService.update(target_id, result).subscribe(item => {
                    ////////console.log'updated item', item);
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
                  ////////console.log'updated item', JSON.stringify(item));
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
            //console.logresult);
            if (result) {

              if ('valid_from' in result) {
                result['valid_from'] = this.localToUTC(result['valid_from']);
              }

              if ('valid_to' in result) {
                result['valid_to'] = this.localToUTC(result['valid_to']);
            }

              //console.logresult);
              if (this.item.location) {
                if ('location' in result === false) {
                    result.location = JSON.stringify(this.item.location);
                }
              }
              ////////console.logthis.item);
              //////console.logthis.control);
              //////console.logthis.formItem);
              let attrs = this.collectItemAttributes(this.item, {});

              if (this.formItem) {
                attrs = this.collectItemAttributes(this.formItem, attrs);
              } else if(this.control) {
                attrs = this.collectItemAttributes(this.control, attrs);
              }
              //////console.logattrs);
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

              //////console.log'includeParent, includeId:', includeParent, includeId);

              if(includeParent) {
                result['parent_id'] = this.item.id;
              }
              if(includeId) {
                result['id'] = this.item.id;
              }

              this.itemService.invoke(attrs['path'], attrs['method'], result).subscribe(items => {
                //const i = Object.values(items);
                ////console.log'invoked items', JSON.stringify(items));
                //this.sessionService.activateItems(items);
                console.log('refreshing item');
                this.sessionService.refresh();
              });
              //result = this.getUpdateParams2(this.formGroup!.value,true);
              
            }
          }
        } else if (command === "Find") {
          ////////console.log"*** find_item ***", this.formGroup!.value);
          this.itemService.items(this.queryFromItem(this.getUpdateParams2(this.formGroup!.value))).subscribe(items => {
            this.sessionService.activateItems(items);
          });
        } else if (command === "Reset") {
          /*
          if (this.onRefresh) {
            this.onRefresh.emit();
          }*/
          ////////console.log"*** reset_item ***");
          if (this.item) {
            this.sessionService.activateItem(this.item);
          } else {
            this.sessionService.activateItem(new Item());
          }
        } else if (command === "Import") {
          //console.log'*** Import ***');
          //console.logthis.uploader);
          this.presentForm('', true, false, this.uploader.nativeElement, this.item, undefined)
          ////////console.log"*** delete_item ***");
        }
          else if (command === "Delete") {
          ////////console.log"*** delete_item ***");
        } else {
          //console.log"*** unknown ***", command);
        }
        }
      }
    }
  }

  shouldClose() {
    //console.log('should close');
    if (this.control) {
      //console.log('has control', this.control);
      const attrs = this.collectItemAttributes(this.control, {});
      if ('close' in attrs) {
        //console.log('has attrs');
        return attrs['close'].toLowerCase() === 'true';
      }
    }
    return false;
  }

  importFile(event: any) {
    //console.logthis.control);
    if (this.control && this.item && this.item.id) {
      const attrs = this.collectItemAttributes(this.control, this.collectItemAttributes(this.item, {}));
      let endpoint_id = this.item.id;
      if ('path' in attrs) {
        endpoint_id = attrs['path'];
      }
      this.itemService.postFileToEndpoint(endpoint_id, event.target.files[0]).subscribe(
        (event: HttpEvent<Object>) => {
          if (event.type === HttpEventType.UploadProgress) {
            if (event.total) {
              let uploadProgress = Math.round(event.loaded / event.total * 100);
              ////console.logog(`Uploaded! ${uploadProgress}%`);
            }
            
            /*
            if (progressFn) {
              progressFn(uploadProgress);
            }*/
            //this.snackBar.open("File uploaded");
          } else if (event.type === HttpEventType.Response) {
            //console.logevent);
            if (event.status === 200 || event.status === 201) {
              //console.log"*** 1")
              if(this.onRefresh) {
                //console.log"*** 2")
                if (event.body) {
                  const items: Item[] = Object.values(event.body);
                  this.sessionService.activateItems(items);
                }
                  
                //this.onRefresh.emit(event.body);
              }
            }
            this.snackBar.open(event.statusText);
            
          } else {
            ////console.logog(event);
            this.snackBar.open("File uploaded");
          }
        });
    }
    
  }
}
