import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {AuthService} from "../services/auth.service";
import { AppService } from '../services/app.service';
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {LoginComponent} from "../login/login.component";

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
  apps = [];

  constructor(private authService: AuthService,
              private appService: AppService,
              public dialog: MatDialog,
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
    this.appService.apps().subscribe(apps => {
      this.apps = apps;
    });
  }

  ngOnInit() {
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  login() {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '400px',
      height: '600px',
      data: {  }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
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
