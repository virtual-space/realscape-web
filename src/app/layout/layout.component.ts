import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";

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

  constructor(private authService: AuthService,
              mediaObserver: MediaObserver,
              private router: Router)
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
    this.loggedIn = this.authService.isLoggedIn();
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['']);
    // this.keycloakService.logout(window.location.origin + `/items/search`);
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
