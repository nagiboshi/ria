import { ReplaySubject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { IUserModel } from './../models/user.model';
import { Injectable } from '@angular/core';
import { ApiService } from "./api.service";

@Injectable()
export class AuthService {

  _isUserLoaded: boolean = false;
  _user: ReplaySubject<IUserModel> = new ReplaySubject(1);

  constructor(
    private _api: ApiService,
  ) {}

  getUser(): Observable<IUserModel> {
    if (!this._isUserLoaded) {
      this._isUserLoaded = true;
      const token: string = localStorage.getItem('token');
      // console.log('token', token);

      if (!token) {
        setTimeout(() => this._user.next(null));
      } else {
        this._api.setToken(token);
        this._api
          .get('user')
          .then((user: IUserModel) => {
            if (!user || user.role !== 'admin') {
              throw new Error('Access denied');
            }
            this._user.next(user);
          })
          .catch(() => {
            localStorage.setItem('token', null);
            this._user.next(null);
          });
      }
    }

    return this._user.asObservable();
  }

  signIn(email: string, password: string): Promise<void> {
    return this._api
      .post('user/sign-in', { email, password })
      .then(({ token, user }) => {
        if (!user || user.role !== 'admin') {
          return Promise.reject({
            code: 5002,
            message: 'Access denied.'
          });
        }
        // console.log('token', token);
        this._api.setToken(token);
        this._user.next(user);
        localStorage.setItem('token', token);
      });
  }

  signOut(): Promise<void> {
    return this._api
      .get('user/sign-out')
      .then(() => {
        this._user.next(null);
        localStorage.setItem('token', null);
        this._api.setToken('');
      });
  }

}
