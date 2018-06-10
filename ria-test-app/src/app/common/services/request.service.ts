import {Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {Observable} from "rxjs/Observable";

@Injectable()
export class RequestService {
  constructor(
    private _api: ApiService
  ) {}

  createRequest(title, name, phoneNumber): Observable<void> {
    return this._api
      .post('request/add', { title, name, phoneNumber });
  }

}
