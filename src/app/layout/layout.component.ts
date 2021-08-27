import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import {KeycloakService} from "keycloak-angular";
import {MediaChange, MediaObserver} from '@angular/flex-layout';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  title = 'RealNet';
  subscription: Subscription;
  current: any;
  loggedIn = false;
  firstName = '';
  lastName = '';
  currentNavGroup = '';
  watcher: Subscription;
  isMobile = false;

  constructor(
    private keycloakService: KeycloakService,
    mediaObserver: MediaObserver)
  {
    this.watcher = mediaObserver.media$.subscribe((change: MediaChange) => {
      if ( change.mqAlias == 'xs') {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
  }

  ngOnInit() {
    this.keycloakService.isLoggedIn().then(res1 => {
      this.loggedIn = res1;
      if (this.loggedIn) {
        this.keycloakService.loadUserProfile().then(up => {
          this.firstName = up['firstName'];
          this.lastName = up['lastName'];
        });
      }
    });
  }

  login() {
    this.keycloakService.login();
  }

  logout() {
    this.keycloakService.logout(window.location.origin + `/items/search`);
  }

  account() {
    window.location.href = 'https://auth.realnet.io/auth/realms/realnet/account';
  }

  get username(): string {
    if (this.isMobile) {
      return `${this.firstName.substring(0, 1)} ${this.lastName.substring(0, 1)}`;
    } else {
      return `${this.firstName} ${this.lastName}`;
    }
  }

  setCurrent(routeName) : void {
    this.currentNavGroup = routeName;
  }
}
