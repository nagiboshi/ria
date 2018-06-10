import { Subscriber } from 'rxjs';
import { CompanyRequestService } from './company-request.service';
import { ApiService } from './../api.service';
import { ICompanyModel } from './../../models/company.model';
import { CompanyService } from './company.service';

describe('CompanyService', () => {
  let companyService: CompanyService
    , companyReqServiceSpy: {updateById: jasmine.Spy, create: jasmine.Spy, getAll: jasmine.Spy};

  function setup(initValue: ICompanyModel[]) {
    companyReqServiceSpy.getAll.and.returnValue(Promise.resolve(initValue));
    companyService.getCompanies().subscribe();
  }

  beforeEach(() => {
    companyReqServiceSpy = jasmine.createSpyObj('CompanyRequestService', ['updateById', 'create', 'getAll']);
    companyService = new CompanyService(null, <any> companyReqServiceSpy)
  });

  it('should update', (done: DoneFn) => {
    let initCompanies = [
      {_id: 'jfdlksfjl1', name: 'lkfdjsflk1', code: 'lfkdsjfl1'},
      {_id: 'jfdlksfjl2', name: 'lkfdjsflk2', code: 'lfkdsjfl2'},
      {_id: 'jfdlksfjl3', name: 'lkfdjsflk3', code: 'lfkdsjfl3'}
    ]
    setup(initCompanies);
    let expectedCompany: ICompanyModel = {_id: 'jfdlksfjl1', name: 'test', code: 'test-code'};
    companyReqServiceSpy.updateById.and.returnValue(Promise.resolve(expectedCompany));

    initCompanies.splice(0, 1, expectedCompany)

    companyService
      .updateCompany(expectedCompany)
      .then(() => companyService._companies.value)
      .then((companies: ICompanyModel[]) => {
        let findedCompany = companies.find((item: ICompanyModel) => item._id === expectedCompany._id);
        expect(findedCompany).toEqual(expectedCompany, 'company with specified id should be update');
        expect(companies).toEqual(initCompanies, 'companies in service equal result')
        done();
      });
  });
});