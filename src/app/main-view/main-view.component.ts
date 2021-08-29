import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";


@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss']
})
export class MainViewComponent implements OnInit {

  navLinks: any[];
  navLinksLoggedIn: any[];
  navLinksNotLoggedIn: any[];
  activeLinkIndex = -1;
  loggedIn = false;
  username = null;

  constructor(private router: Router,
              private authService: AuthService) {
    this.navLinksLoggedIn = [
      {
        label: 'Search',
        link: './search',
        index: 0,
        open: true
      }, {
        label: 'Around',
        link: './around',
        index: 1,
        open: true
      }, {
        label: 'Home',
        link: './home',
        index: 2,
        open: false
      }
    ];
    this.navLinksNotLoggedIn = this.navLinksLoggedIn.filter(l => l.open);
    this.navLinks = this.navLinksNotLoggedIn;
  }

  ngOnInit() {
    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
    });

    this.loggedIn = this.authService.isLoggedIn();
  }
  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }

  account() {
    window.location.href = 'https://auth.realnet.io/auth/realms/realnet/account';
  }

}
