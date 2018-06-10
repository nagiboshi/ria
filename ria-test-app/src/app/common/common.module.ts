import { NgModule } from '@angular/core';
import { ApiService } from './services/api.service';
import { AuthService } from "./services/auth.service";
import { HttpClientModule } from "@angular/common/http";
import { UserService } from "./services/user.service";
import {RequestService} from "./services/request.service";
import {TestService} from "./services/test.service";
import {FileService} from "./services/file.service";

@NgModule({
  imports: [
    HttpClientModule
  ],
  exports: [],
  providers: [
    ApiService,
    UserService,
    AuthService,
    RequestService,
    TestService,
    FileService
  ]
})
export class CommonModule {}
