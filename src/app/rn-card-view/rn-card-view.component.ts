import { Component, OnInit } from '@angular/core';
import { RnViewComponent } from '../rn-view/rn-view.component';
import { Item, itemIsInstanceOf } from '../services/item.service';


@Component({
  selector: 'app-rn-card-view',
  templateUrl: './rn-card-view.component.html',
  styleUrls: ['./rn-card-view.component.sass']
})
export class RnCardViewComponent  extends RnViewComponent implements OnInit {

  hasButtons() {
    return this.getItemControls(this.item!).filter(c => itemIsInstanceOf(c, "ButtonCtrl")).length > 0;
  }

  getContentType(item?: Item) {
    let content_type = undefined;
    if(item && item.attributes && 'content_type' in item.attributes) {
      content_type = item.attributes['content_type'];
      //console.log('*** content_type is ', content_type);
    }
    return content_type;
  }

  isImage(item?: Item) {
    const content_type = this.getContentType(item);
    if (content_type) {
      //console.log('*** content_type is ', content_type, 'result is ', new Set(['image/jpeg', 'image/jpg', 'image/png']).has(content_type));
      return new Set(['image/jpeg', 'image/jpg', 'image/png']).has(content_type);
    }
    return false;

  }

  hasImage() {
    return this.isImage(this.item);
  }

  loadImage() {
    console.log('load image');
  }

}
