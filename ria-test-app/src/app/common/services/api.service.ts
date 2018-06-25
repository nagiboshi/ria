import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {HttpHeaders} from '@angular/common/http';
import {ServerResponse} from '../models/server-response';
import {Observable} from "rxjs/Observable";
import 'rxjs/Rx';

@Injectable()
export class ApiService {

//  private _basePath: string = 'http://localhost:3000/';
  // private _basePath: string = 'https://ria-test-backend.herokuapp.com/';
  private _basePath: string = 'http://trust2.info/';
  httpOptions: object = { headers: HttpHeaders };

  constructor(
    private _http: HttpClient
  ) {}

  get(path, params = null): Observable<any> {
    let resultPath = `${this._basePath}${path}`;

    if (params) {
      resultPath += '?';
      Object.keys(params).forEach(key => {
        resultPath += `${key}=${params[key]}&`;
      });
      resultPath = resultPath.slice(0, -1);
    }


    return this._http
      .get(resultPath, this.httpOptions)
      .map((data: ServerResponse) => {
        if (!data.success) {
          console.error('Server response: ', data.error);
          throw data.error;
        }

        return data.data;
      });
  }

  post(path, body = null) {
    let resultPath = `${this._basePath}${path}`;

    return this._http
      .post(resultPath, body, this.httpOptions)
      .map((data: ServerResponse) => {
        if (!data.success) {
          console.error('Server response: ', data.error);
          debugger;
          throw data.error;
        }

        return data.data;
      });
  }

  setToken(Authorization) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization
      })
    };
  }

}
