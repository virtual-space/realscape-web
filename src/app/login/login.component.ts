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

  constructor(private authService: AuthService,
              public dialogRef: MatDialogRef<LoginComponent>,
              public dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    const ass = this.authService.authenticators();
    console.log(ass);
    ass.subscribe(auths => {
      this.authenticators = auths;
    });
  }

  openAuthLink(auth) {
    this.authService.login(auth);
  }

  onOkClick(): void {
    this.dialogRef.close();
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
