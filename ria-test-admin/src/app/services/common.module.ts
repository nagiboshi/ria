import { HttpClientModule } from '@angular/common/http';
import { CompanyService } from './company.service';
import { NgModule } from '@angular/core';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';
import { UserService } from './user.service';
import { RequestService } from './request.service';

@NgModule({
  imports: [
    HttpClientModule
  ],
  exports: [],
  declarations: [],
  providers: [
    AuthService,
    ApiService,
    UserService,
    CompanyService,
    RequestService
  ]
})
export class CommonModule { }
