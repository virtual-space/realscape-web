import { Component, OnInit } from '@angular/core';
import { RnViewComponent } from '../rn-view/rn-view.component';

@Component({
  selector: 'app-rn-cards-view',
  templateUrl: './rn-cards-view.component.html',
  styleUrls: ['./rn-cards-view.component.sass']
})
export class RnCardsViewComponent extends RnViewComponent implements OnInit {

    override ngOnInit(): void {
      console.log(this);
    }
}
