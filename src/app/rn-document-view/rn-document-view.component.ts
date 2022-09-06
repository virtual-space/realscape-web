import { Component, OnInit } from '@angular/core';
import { RnViewComponent } from '../rn-view/rn-view.component';

@Component({
  selector: 'app-rn-document-view',
  templateUrl: './rn-document-view.component.html',
  styleUrls: ['./rn-document-view.component.sass']
})
export class RnDocumentViewComponent extends RnViewComponent implements OnInit {

  override ngOnInit(): void {
    ////console.log(this.item)
  }


}
