import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-realscape-app',
  templateUrl: './realscape-app.component.html',
  styleUrls: ['./realscape-app.component.scss']
})
export class RealscapeAppComponent implements OnInit {

  app = null;

  constructor(private route: ActivatedRoute,
              private appService: AppService) { }

  ngOnInit() {
    const name = this.route.snapshot.paramMap.get('name');
    if (name) {
      this.appService.apps().subscribe(apps => {
        this.app = apps.filter(app => app.name.toLowerCase() === name.toLowerCase())[0];
      });
    }
   }

}
