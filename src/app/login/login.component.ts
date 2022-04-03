import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "../services/auth.service";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  authenticators = [];

  constructor(private authService: AuthService) { }

  ngOnInit() {
    const ass = this.authService.authenticators().subscribe(auths => {
      this.authenticators = auths;
    });
  }

  openAuthLink(auth) {
    this.authService.login(auth);
  }

}
