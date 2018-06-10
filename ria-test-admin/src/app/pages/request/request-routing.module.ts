import { RequestListComponent } from './list/request-list.component';
import { AuthGuard } from './../../guards/auth-guard.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestComponent } from './request.component';

const routes: Routes = [
  {
    path: 'request',
    component: RequestComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        children: [
          {path: '', redirectTo: '/request/list', pathMatch: 'full'},
          {path: 'list', component: RequestListComponent}
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: [],
  providers: [
    AuthGuard
  ],
})
export class RequestRoutingModule { }
