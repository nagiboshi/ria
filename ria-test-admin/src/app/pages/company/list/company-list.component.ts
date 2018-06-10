import { ICompanyModel } from './../../../models/company.model';
import { CompanyAddDialogComponent } from './company-add-dialog/company-add-dialog.component';
import { CompanyEditDialogComponent } from './company-edit-dialog/company-edit-dialog.component';
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CompanyService } from '../../../services/company.service';
import {CompanyRemoveDialogComponent} from './company-remove-dialog/company-remove-dialog.component';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css']
})
export class CompanyListComponent implements OnInit {

  @Input() companyName: string;

  companies: ICompanyModel[] = [];
  columns: string[] = [ 'delete', 'editor', 'name', 'code' ];

  constructor(
    private _companyService: CompanyService,
    private _dialogCtrl: MatDialog
  ) {}

  ngOnInit() {
    this._companyService.getCompanies().subscribe((companies: ICompanyModel[]) => {
      this.companies = companies;
    });
  }

  addCompany() {
    this._dialogCtrl
      .open(CompanyAddDialogComponent, { width: '250px' });
  }

  editCompany(company: ICompanyModel) {
    this._dialogCtrl
      .open(CompanyEditDialogComponent, { width: '250px', data: { ...company } });
  }

  removeCompanyById(company: ICompanyModel) {
    this._dialogCtrl
      .open(CompanyRemoveDialogComponent, { width: '250px' })
      .afterClosed()
      .subscribe((answer: boolean) => {
        if (!answer) {
          return;
        }

        this._companyService.removeById(company._id);
      });
  }

}
