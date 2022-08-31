import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.sass']
})
export class CallbackComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.route.fragment.subscribe((fragment) => {
      // //console.log("My hash fragment is here => ", fragment);
      if (fragment) {
        const access_token = new URLSearchParams(fragment).get('access_token');
        if (access_token) {
          this.authService.setAccessToken(access_token);
          this.router.navigate(['']);
        }
      }
    });
  }

}
