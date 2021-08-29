import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.route.fragment.subscribe((fragment: string) => {
      console.log("My hash fragment is here => ", fragment);
      const access_token = new URLSearchParams(fragment).get('access_token')
      this.authService.setAccessToken(access_token);
      this.router.navigate(['']);
    });
  }

}
