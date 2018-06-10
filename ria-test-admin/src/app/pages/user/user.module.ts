import { UserListComponent } from './list/user-list.component';
import { SharedModule } from '../../shared/shared.module';
import { UserComponent } from './user.component';
import { NgModule } from '@angular/core';
import { UserRoutingModule } from './user.routing-module';
import {UserRemoveDialogComponent} from './list/user-remove-dialog/user-remove-dialog.component';

const components = [
  UserComponent,
  UserListComponent,
  UserRemoveDialogComponent
];

@NgModule({
  imports: [
    SharedModule,
    UserRoutingModule
  ],
  exports: [],
  entryComponents: [...components],
  declarations: [...components]
})
export class UserModule { }
