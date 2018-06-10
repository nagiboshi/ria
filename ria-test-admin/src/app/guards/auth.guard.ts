import { IUserModel } from './../models/user.model';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private _auth: AuthService,
    private _router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this._auth
      .getUser()
      .map((user: IUserModel) => {
        if (!user) {
          console.log('denied');
          this._router.navigate(['/auth']);
          return false;
        }

        return true;
      });
  }

}
