import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import { itemIsInstanceOf, ItemService } from '../services/item.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthService,
              private itemService: ItemService,
              private router: Router) { }

  ngOnInit(): void {
    const loggedIn = this.authService.isLoggedIn();
    this.itemService.types().subscribe(types => {
      //////console.logtypes);
      this.itemService.setTypes(types);
      this.itemService.apps().subscribe(apps => {
        if (apps) {
          this.itemService.setApps(apps);
            const initial_app = apps.find(aa => aa.attributes? (aa.attributes['initial'] === 'true') : false);
            this.itemService.forms().subscribe(forms => {
              this.itemService.setForms(forms);
              if (initial_app) {
                this.router.navigate(['/items', initial_app.id!]);
              } else {
                this.router.navigate(['/items', apps[0].id!]);
              }
            });
        } 
      });
    });
  }

}
