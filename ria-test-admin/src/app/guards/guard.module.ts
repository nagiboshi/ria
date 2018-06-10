import { AuthGuard } from './auth.guard';
import { NgModule } from "@angular/core";

@NgModule({
  providers: [
    AuthGuard
  ]
})
export class GuardModule {}