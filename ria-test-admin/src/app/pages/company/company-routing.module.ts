import { AuthGuard } from './../../guards/auth-guard.service';
import { CompanyListComponent } from './list/company-list.component';
import { UserComponent } from './../user/user.component';
import { CompanyComponent } from './company.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'company',
    component: UserComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        children: [
          { path: '', redirectTo: '/company/list', pathMatch: 'full' },
          { path: 'list', component: CompanyListComponent }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: []
})
export class CompanyRoutingModule { }
