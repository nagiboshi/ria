import { AuthGuard } from './../../guards/auth-guard.service';
import { UserListComponent } from './list/user-list.component';
import { UserComponent } from './user.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'user',
    component: UserComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        children: [
          { path: '', redirectTo: '/user/list', pathMatch: 'full' },
          { path: 'list', component: UserListComponent }
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
export class UserRoutingModule { }
