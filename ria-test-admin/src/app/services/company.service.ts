import { ICompanyModel } from './../models/company.model';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CompanyService {

  _companies: BehaviorSubject<ICompanyModel[]> = new BehaviorSubject([]);
  _isLoaded = false;

  constructor(
    private _api: ApiService
  ) { }

  getCompanies(): Observable<ICompanyModel[]> {
    if (!this._isLoaded) {
      this._api
        .get('companies')
        .then((companies: ICompanyModel[]) => {
          this._isLoaded = true;
          this._companies.next(companies);
        });
    }

    return this._companies.asObservable();
  }

  addCompany(name: string): Promise<void> {
    return this._api
      .post('company/add', { name })
      .then((company: ICompanyModel) => {
        this._companies.next([ ...this._companies.getValue(), company ]);
      });
  }

  updateCompany(company: ICompanyModel): Promise<void> {
    return this._api
      .post('company/update', company)
      .then((updatedCompany: ICompanyModel) => {
        const companies = [ ...this._companies.getValue() ];
        const index = companies.findIndex((item: ICompanyModel) => {
          return item._id === company._id;
        });
        companies.splice(index, 1, updatedCompany);
        this._companies.next(companies);
      });
  }

  removeById(_id: string): Promise<void> {
    return this._api
      .get('company/remove', { _id })
      .then(() => {
        const companies = this._companies.getValue().filter((company: ICompanyModel) => {
          return company._id !== _id;
        });
        this._companies.next(companies);
      });
  }

}
