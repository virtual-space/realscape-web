import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import { ItemService } from '../services/item.service';

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
    this.itemService.apps().subscribe(apps => {
      if (apps) {
        const app = apps.find(a => {
          if (a) {
            if (loggedIn) {
              if (a.attributes) {
                if (a.attributes['initial'] == 'true') {
                  return true;
                }
              }
            } else {
              if(a.type!.name! !== 'LoginApp') {
                return true;
              }
            }
          }
          return false;
        });
        if (app) {
          this.router.navigate(['/items', app.id!]);
        }
      } 
    });
  }

}
