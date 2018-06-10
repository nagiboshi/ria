import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable, OnInit } from '@angular/core';
import { ApiService } from "./api.service";
import { Subject } from "rxjs/Subject";
import { AuthService } from "./auth.service";
import { IUserModel } from '../models/user.model';

@Injectable()
export class UserService implements OnInit {

  _users: BehaviorSubject<IUserModel[]> = new BehaviorSubject<IUserModel[]>([]);
  _isLoaded: boolean = false;

  constructor(
    private _api: ApiService,
    private _auth: AuthService
  ) {}

  ngOnInit() {}

  getUsers(): Observable<IUserModel[]> {
    if (!this._isLoaded) {
      this._api.get('users')
        .then((users: IUserModel[]) => {
          this._isLoaded = true;
          this._users.next(users);
        })
    }

    return this._users.asObservable();
  }

  removeUserById(_id: string): Promise<void> {
    return this._api
      .get('user/remove', { _id })
      .then((users: IUserModel[]) => {
        this._users.next(users);
      });
  }

  passwordRecovery(email: string): Promise<void> {
    return this._api
      .get('user/password/recovery', { email });
  }

}
