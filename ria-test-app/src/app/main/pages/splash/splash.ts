import {Component} from '@angular/core';
import {NavController} from "ionic-angular";
import {SignInPage} from "../sign-in/sign-in";
import {MainPage} from "../../main";
import {AuthService} from "../../../common/services/auth.service";

@Component({
  selector: 'splash-page',
  templateUrl: 'splash.html',
})

export class SplashPage {
  isLoginUser: boolean = false;

  constructor(
    private navCtrl: NavController,
    private _authService: AuthService
  ) {
    this._authService.getUser().subscribe(user => {
      if (!user) {
        this.isLoginUser = false;
        return this.navCtrl.setRoot(SignInPage);
      }
      if(!this.isLoginUser) {
        this.isLoginUser = true;
        this.navCtrl.setRoot(MainPage);
      }
    });
  }

}
