import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {KeycloakService} from "keycloak-angular";

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
              private keycloakService: KeycloakService) {
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
    this.keycloakService.isLoggedIn().then(res1 => {
      this.loggedIn = res1;
      if (this.loggedIn) {
        console.log('Logged in');
        this.keycloakService.loadUserProfile().then(up => {
          this.username = up['firstName'] + ' ' + up['lastName'];
          this.navLinks = this.navLinksLoggedIn;
        });
      } else {
        console.log('Not logged in');
      }
    });
    /*
    this.keycloakService.getToken().then(res => {
      console.log(res);
      this.keycloakService.isLoggedIn().then(res1 => {
        this.loggedIn = res1;
        if (this.loggedIn) {
          this.keycloakService.loadUserProfile().then(up => {
            //this.username = up['firstName'] + ' ' + up['lastName'];
          });
        }
      });
    });*/
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

}
