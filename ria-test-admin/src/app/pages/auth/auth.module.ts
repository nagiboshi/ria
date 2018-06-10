import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { AuthComponent } from './auth.component';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  imports: [
    SharedModule,
    AuthRoutingModule
  ],
  exports: [],
  declarations: [ AuthComponent ],
  providers: [],
  bootstrap: [ AuthComponent ]
})
export class AuthModule { }
