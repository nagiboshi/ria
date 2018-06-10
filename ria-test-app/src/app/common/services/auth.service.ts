import {Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {Storage} from "@ionic/storage";
import {IUserModel} from "../models/user";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {Observable} from "rxjs/Observable";

@Injectable()
export class AuthService {

  public _user: ReplaySubject<IUserModel> = new ReplaySubject(1);
  private _isLoaded: boolean = false;

  constructor(
    private _api: ApiService,
    private _storage: Storage,
  ) {}

  getUser(): Observable<IUserModel> {
    if (!this._isLoaded) {
      this._storage.get('token')
        .then((token: string) => {
          if (!token) {
            this._isLoaded = true;
            return this._user.next(null);
          }

          this._api.setToken(token);
          this._api.get('user')
            .subscribe(
              (user: IUserModel) => {
                this._user.next(user);
                this._isLoaded = true;
              },
              () => {
                this._storage.set('token', null);
                this._isLoaded = true;
                this._user.next(null)
              }
            );
        });
    }

    return this._user.asObservable();
  }

  signIn(email, password): Observable<IUserModel> {
    return this._api
      .post('user/sign-in', { email, password })
      .map(({ token, user }) => {
        // console.log('sign in', email, password);
        this._user.next(user);
        this._isLoaded = true;
        this._storage.set('token', token);
        this._api.setToken(token);
        return user;
      });
  }

  signUp(company, email, password): Observable<IUserModel> {
    return this._api
      .post('user/sign-up', { company, email, password })
      .flatMap(() => {
        // console.log('sign up success', company, email, password);
        return this.signIn(email, password);
      });
  }

  signOut(): Observable<void> {
    return this._api
      .get('user/sign-out')
      .map(() => {
        this._user.next(null);
        this._storage.set('token', null);
      });
  }

  recoveryPassword(email): Observable<void> {
    return this._api
      .get('user/password/recovery', { email });
  }

  updateUser(dataUser): Observable<IUserModel> {
    return this._api
      .post('user/update', dataUser)
      .map((data) => {
        this._user.next(data);
        this._isLoaded = true;
        return data;
      });
  }

}
