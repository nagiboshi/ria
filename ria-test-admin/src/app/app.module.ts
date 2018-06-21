import { RequestModule } from './pages/request/request.module';
import { CommonModule } from './services/common.module';
import { CompanyModule } from './pages/company/company.module';
import { UserModule } from './pages/user/user.module';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { AuthModule } from './pages/auth/auth.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ArticleModule } from './pages/article/article.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    AuthModule,
    UserModule,
    CompanyModule,
    ArticleModule,
    RequestModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
