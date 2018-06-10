import { RequestListComponent } from './list/request-list.component';
import { RequestComponent } from './request.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { RequestRoutingModule } from './request-routing.module';

const components = [
  RequestComponent,
  RequestListComponent
];

@NgModule({
  imports: [
    SharedModule,
    RequestRoutingModule
  ],
  exports: [],
  entryComponents: [...components],
  declarations: [...components],
})
export class RequestModule { }
