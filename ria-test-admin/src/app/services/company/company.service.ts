import { ICompanyModel } from '../../models/company.model';
import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { CompanyRequestService } from './company-request.service';

@Injectable()
export class CompanyService {

  _companies: BehaviorSubject<ICompanyModel[]> = new BehaviorSubject([]);
  _isLoaded: boolean = false;

  constructor(
    private _api: ApiService,
    private _companyReqService: CompanyRequestService
  ) { }

  getCompanies(): Observable<ICompanyModel[]> {
    // if (!this._isLoaded) {
      this._companyReqService
        .getAll()
        .then((companies: ICompanyModel[]) => {
          this._isLoaded = true;
          this._companies.next(companies);
        });
    // }

    return this._companies.asObservable();
  }

  addCompany(name: string): Promise<void> {
    return this._companyReqService
      .create(name)
      .then((company: ICompanyModel) => {
        this._companies.next([ ...this._companies.getValue(), company ])
      });
  }

  updateCompany(company: ICompanyModel): Promise<ICompanyModel> {
    return this._companyReqService
      .updateById(company)
      .then((updatedCompany: ICompanyModel) => {
        let companies = [ ...this._companies.getValue() ];
        let index = companies.findIndex((item: ICompanyModel) => {
          return item._id === company._id
        });
        companies.splice(index, 1, updatedCompany);
        this._companies.next(companies);
        return updatedCompany;
      });
  }

  removeById(_id: string): Promise<void> {
    return this._api
      .get('company/remove', { _id })
      .then(() => {
        let companies = this._companies.getValue().filter((company: ICompanyModel) => {
          return company._id !== _id;
        });
        this._companies.next(companies);
      });
  }

}
