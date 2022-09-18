import { Component, OnInit } from '@angular/core';
import { RnViewComponent } from '../rn-view/rn-view.component';

@Component({
  selector: 'app-rn-page-view',
  templateUrl: './rn-page-view.component.html',
  styleUrls: ['./rn-page-view.component.sass']
})
export class RnPageViewComponent extends RnViewComponent implements OnInit {
  html: string | undefined = undefined;

  override ngOnInit(): void {
    ////console.log'initialize');
    if (this.item && this.item.attributes && 'html' in this.item.attributes) {
      ////console.log'hello');
      this.html = this.item.attributes['html'];
    }
  }

  protected override initialize(): void {
    ////console.log'initialize');
    if (this.item && this.item.attributes && 'html' in this.item.attributes) {
      ////console.log'hello');
      this.html = this.item.attributes['html'];
    } 
  }

}
