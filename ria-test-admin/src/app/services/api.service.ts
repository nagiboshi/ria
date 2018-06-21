import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { IServerResponseModel } from '../models/server-response.model';

@Injectable()
export class ApiService {

     _basePath = 'http://localhost:3000/';
  // _basePath = 'https://ria-test-backend.herokuapp.com/';
  // _basePath = 'http://trust2.info/';
  _httpOptions: object = { headers: null };

  constructor(private _http: HttpClient) {}

  get(path: string, params: object = null): Promise<any> {
    let resultPath = `${this._basePath}${path}`;

    if (params) {
      resultPath += '?';
      Object.keys(params).forEach((key, index) => {
        resultPath += `${key}=${params[key]}&`;
      });
      resultPath = resultPath.slice(0, -1);
    }

    return this._http
      .get(resultPath, this._httpOptions)
      .toPromise()
      .then((response: IServerResponseModel) => {
        if (!response.success) {
          return Promise.reject(response.error);
        }

        return response.data;
      });
  }

  post(path, body: object = null): Promise<any> {
    const resultPath = `${this._basePath}${path}`;

    return this._http
      .post(resultPath, body, this._httpOptions)
      .toPromise()
      .then((response: IServerResponseModel) => {
        if (!response.success) {
          return Promise.reject(response.error);
        }

        return response.data;
      });
  }

  put(path, body: object = null): Promise<any> {
    const resultPath = `${this._basePath}${path}`;

    return this._http
      .put(resultPath, body, this._httpOptions)
      .toPromise()
      .then((response: IServerResponseModel) => {
        if (!response.success) {
          return Promise.reject(response.error);
        }

        return response.data;
      });
  }

  setToken(Authorization: string): void {
    this._httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization
      })
    };
  }

}
