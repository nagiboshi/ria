import { Injectable } from '@angular/core';
import { ApiService } from "./api.service";

@Injectable()
export class UserService {
  constructor(
    private _api: ApiService,
  ) {}

  passwordRecovery(email) {
    return this._api
      .get('user/password/recovery', { email });
  }

}
