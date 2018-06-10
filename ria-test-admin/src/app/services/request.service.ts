import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { IRequestModel } from '../models/request.model';

@Injectable()
export class RequestService {

  _requests: BehaviorSubject<IRequestModel[]> = new BehaviorSubject([]);
  _isLoaded = false;

  constructor(
    private _api: ApiService
  ) {}

  getRequests(): Observable<IRequestModel[]> {
    if (!this._isLoaded) {
      this._api
        .get('requests')
        .then((requests: IRequestModel[]) => {
          this._isLoaded = true;
          this._requests.next(requests);
        });
    }

    return this._requests.asObservable();
  }

  updateRequestById(request: IRequestModel) {
    this._api
      .put('request', request)
      .then((updatedRequest: IRequestModel) => {
        const requests = [ ...this._requests.getValue() ];
        const index = requests.findIndex((item: IRequestModel) => {
          return item._id === updatedRequest._id;
        });
        requests.splice(index, 1, updatedRequest);
        this._requests.next(requests);
      });
  }

}
