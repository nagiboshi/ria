import { Observable } from 'rxjs/Observable';
import { ICompanyModel } from './../../models/company.model';
import { ApiService } from './../api.service';
import { Injectable } from '@angular/core';

@Injectable()
export class CompanyRequestService {
  constructor(
    private _apiService: ApiService
  ) {}

  getAll(): Promise<ICompanyModel[]> {
    return this._apiService.get('companies');
  }

  updateById(data: ICompanyModel): Promise<ICompanyModel> {
    return this._apiService.post('company/update', data);
  }

  create(data: string): Promise<ICompanyModel> {
    return this._apiService.post('company/add', {name: data});
  }
}