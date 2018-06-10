import { IUserModel } from './../../../models/user.model';
import { AuthService } from './../../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-base',
  templateUrl: 'base.component.html',
  styleUrls: [ 'base.component.css' ]
})

export class BaseComponent implements OnInit {
  constructor(
    private _auth: AuthService,
    private _router: Router
  ) {}

  ngOnInit() {}

  signOut(): void {
    this._auth
      .signOut()
      .then(() => this._router.navigate(['/auth']));
  }

}
