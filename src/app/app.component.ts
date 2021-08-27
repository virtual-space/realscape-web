import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TestService} from './services/test.service';
import { KeycloakProfile } from 'keycloak-js';
import { KeycloakService } from 'keycloak-angular';
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material";
import {CreateItemComponent} from "./create-item/create-item.component";
import {ItemService} from "./services/item.service";
import {ApplicationService} from "./services/application.service";
import {DeleteItemComponent} from "./delete-item/delete-item.component";
import {EditItemComponent} from "./edit-item/edit-item.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private keycloakService: KeycloakService,
              protected testService: TestService,
              protected itemService: ItemService,
              protected appService: ApplicationService,
              protected router: Router,
              public dialog: MatDialog) { }

  ngOnInit() {

  }

  login() {
    this.keycloakService.login().then(res => {
      console.log(res);
    });
  }

  logout() {
    this.keycloakService.logout().then( res => {
      console.log(res);
    });
  }

  account() {
    window.location.href = 'https://auth.realnet.io/auth/realms/realnet/account';
  }

  testPublic() {
    this.testService.testPublic().subscribe(x => {
      console.log(x);
    });
  }

  testPrivate() {
    this.testService.testPrivate().subscribe(x => {
      console.log(x);
    });
  }
}
