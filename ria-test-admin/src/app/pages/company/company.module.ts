import {CompanyComponent} from './company.component';
import {CompanyRoutingModule} from './company-routing.module';
import {CompanyAddDialogComponent} from './list/company-add-dialog/company-add-dialog.component';
import {CompanyEditDialogComponent} from './list/company-edit-dialog/company-edit-dialog.component';
import {CompanyRemoveDialogComponent} from './list/company-remove-dialog/company-remove-dialog.component';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {CompanyListComponent} from './list/company-list.component';

const components = [
  CompanyComponent,
  CompanyListComponent,
  CompanyAddDialogComponent,
  CompanyEditDialogComponent,
  CompanyRemoveDialogComponent
];

@NgModule({
  imports: [
    SharedModule,
    CompanyRoutingModule
  ],
  exports: [],
  entryComponents: [...components],
  declarations: [...components]
})
export class CompanyModule { }
