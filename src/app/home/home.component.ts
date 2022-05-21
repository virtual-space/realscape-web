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
      console.log(types);
      this.itemService.setTypes(types);
      this.itemService.apps().subscribe(apps => {
        if (apps && apps.items) {
          if (loggedIn) {
            const role = apps.items.find(a => itemIsInstanceOf(a, 'Role'));
            if (role && role.items) {
              const apps_item = role.items.find(a => itemIsInstanceOf(a, 'Apps'));
              console.log(apps_item)
              if (apps_item && apps_item.items) {
                this.itemService.setApps(apps_item.items);
                const initial_app = apps_item.items.find(aa => aa.attributes? (aa.attributes['initial'] === 'true') : false);
                if (initial_app) {
                  this.router.navigate(['/items', initial_app.id!]);
                } 
              }
            }
          } else {
            this.itemService.setApps(apps.items);
            const initial_app = apps.items.find(aa => aa.attributes? (aa.attributes['initial'] === 'true') : false);
            if (initial_app) {
              this.router.navigate(['/items', initial_app.id!]);
            }
          }
        } 
      });
    });
  }

}
