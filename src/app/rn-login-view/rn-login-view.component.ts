import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Authenticator, AuthService } from '../services/auth.service';
import { Item } from '../services/item.service';

@Component({
  selector: 'app-rn-login-view',
  templateUrl: './rn-login-view.component.html',
  styleUrls: ['./rn-login-view.component.sass']
})
export class RnLoginViewComponent implements OnInit {

  @Input() login?: Item;
  @Input() button: boolean = false;
  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  doLogin(): void  {
    if (this.login) {
      ////console.log(this.login);
      this.authService.login(new Authenticator(this.login!.attributes!['authenticator_name']!.toString(), 
                                               this.login!.attributes!['authenticator_type']!.toString(),
                                               this.login!.attributes!['client_id']!.toString(),
                                               this.login!.attributes!['api']!.toString(),
                                               this.login!.attributes!['tenant']!.toString()));
    }
    
  }

  doLogout() {
    this.authService.logout();
    this.router.navigate(['']);
  }

}
