import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, Inject } from '@angular/core';
import {ICompanyModel} from "../../../../models/company.model";
import {CompanyService} from "../../../../services/company.service";

@Component({
  selector: 'app-company-add-dialog',
  templateUrl: 'company-add-dialog.component.html',
  styleUrls: ['company-add-dialog.component.css']
})

export class CompanyAddDialogComponent {

  public errorMessage: string;

  constructor(
    private _dialog: MatDialogRef<CompanyAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public companyName: string,
    private _companyService: CompanyService
  ) {}

  onNoClick(): void {
    this._dialog.close();
  }

  close() {
    this._dialog.close();
  }

  add() {
    this._companyService
      .addCompany(this.companyName)
      .then(() => this._dialog.close())
      .catch(this._errorHandler.bind(this));
  }

  _errorHandler(error) {
    switch (error.code) {
      case 5002:
        this.errorMessage = 'Компания с таким названием уже существует';
        break;
      default: return console.error(error);
    }

    return setTimeout(() => this.errorMessage = '', 5000);
  }

}
