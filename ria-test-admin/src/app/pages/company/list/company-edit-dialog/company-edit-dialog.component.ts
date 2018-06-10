import {ICompanyModel} from '../../../../models/company.model';
import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {CompanyService} from '../../../../services/company.service';

@Component({
  selector: 'app-company-edit-dialog',
  templateUrl: 'company-edit-dialog.component.html',
  styleUrls: ['company-edit-dialog.component.css']
})
export class CompanyEditDialogComponent {

  public updatedCompany: ICompanyModel;
  public errorMessage: string;

  constructor(
    private _dialogRef: MatDialogRef<CompanyEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _company: ICompanyModel,
    private _companyService: CompanyService
  ) {
    this.updatedCompany = Object.assign({}, this._company);
  }

  onNoClick(): void {
    this._dialogRef.close();
  }

  close() {
    this._dialogRef.close();
  }

  save() {
    const isUpdated = Object
      .keys(this._company)
      .some(key => {
        return this._company[key] !== this.updatedCompany[key];
      });

    if (!isUpdated) {
      return this._errorHandler({code: 0});
    }

    this._companyService
      .updateCompany(this.updatedCompany)
      .then(() => this._dialogRef.close())
      .catch(this._errorHandler.bind(this));
  }

  _errorHandler(error) {
    switch (error.code) {
      case 0:
        this.errorMessage = 'Ни одно поле компании не изменилось';
        break;
      case 5001:
        this.errorMessage = 'Компании не сущестует';
        break;
      case 5003:
        this.errorMessage = 'Компания с таким именем уже существует';
        break;
      case 5004:
        this.errorMessage = 'Компания с таким кодом уже существует';
        break;
      default: return console.error(error);
    }

    return setTimeout(() => this.errorMessage = '', 5000);
  }

}
