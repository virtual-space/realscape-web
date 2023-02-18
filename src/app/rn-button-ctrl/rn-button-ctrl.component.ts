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
    // this.presentForm('', true, false, this.uploader.nativeElement, this.item, undefined)
    if (this.control && this.control.attributes && ! ('command' in this.control.attributes)) {
      return;
    }

    if (this.item && this.formGroup) {
      let target_id = this.item!.id!;
      let result = this.formGroup.value;
      //console.log(this.item);
      // //console.log(result);
      ////console.log(this.formItem);
      if (this.formItem && result) {

        if (!('type' in result)) {
          if (this.formItem.attributes) {
            if (typeof this.formItem.attributes['type'] === 'string') {
              result['type'] = this.formItem.attributes['type'];
            } else {
              result['type'] = this.formItem.attributes['type']['name'];
            }
          } else if (this.item.attributes && 'type' in this.item.attributes!) {
            if (typeof this.item.attributes['type'] === 'string') {
              result['type'] = this.item.attributes['type'];
            } else {
              result['type'] = this.item.attributes['type']['name'];
            }
          }
        }
      
        

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
        //console.log(this.item);
        //////console.logthis.control);
        //console.log(this.formItem);
        let attrs = this.collectItemAttributes(this.item, {});

        if (this.formItem) {
          attrs = this.collectItemAttributes(this.formItem, attrs);
        } else if(this.control) {
          attrs = this.collectItemAttributes(this.control, attrs);
        }
        //////console.logattrs);
        //result = this.getUpdateParams2(this.formGroup!.value,false);

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
          //console.log('refreshing item');
          this.sessionService.refresh();
          
        });
        //result = this.getUpdateParams2(this.formGroup!.value,true);
        
      }
    }
  }

  shouldClose() {
    ////console.log('should close');
    if (this.control) {
      ////console.log('has control', this.control);
      const attrs = this.collectItemAttributes(this.control, {});
      if ('close' in attrs) {
        ////console.log('has attrs');
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
