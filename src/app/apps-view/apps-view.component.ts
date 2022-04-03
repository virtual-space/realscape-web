import { Component, OnInit } from '@angular/core';
import { AppService } from '../services/app.service';
import { ItemService } from '../services/item.service';

@Component({
  selector: 'app-apps-view',
  templateUrl: './apps-view.component.html',
  styleUrls: ['./apps-view.component.scss']
})
export class AppsViewComponent implements OnInit {

  apps = [];
  constructor(private appService: AppService,
              private itemService: ItemService) { }

  ngOnInit() {
    this.appService.apps().subscribe(apps => {
      this.apps = apps;
    });
  }

}
