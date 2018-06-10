import { Component, Input } from '@angular/core';
import {NavController, ToastController} from "ionic-angular";
import { SignUpPage } from "../sign-up/sign-up";
import { PasswordRecoveryPage } from "../password-recovery/password-recovery";
import { MainPage } from "../../main";
import { AuthService } from "../../../common/services/auth.service";

@Component({
  selector: 'sign-in-page',
  templateUrl: 'sign-in.html'
})

export class SignInPage {

  @Input() email: string;
  @Input() password: string;

  constructor(
    private _navCtrl: NavController,
    private _authService: AuthService,
    private _toastCtrl: ToastController
  ) {}

  signIn() {
    if (!this.email || !this.password) {
      return;
    }

    this._authService
      .signIn(this.email, this.password)
      .subscribe(
        () => this._navCtrl.setRoot(MainPage),
        err => {
          let params = null;

          switch (err.code) {
            case 2001:
              params = {
                message: 'Пользователь с таким email не найден',
                position: 'top',
                duration: 3000
              };
              break;
            case 2004:
              params = {
                message: 'Неверная пара email/пароль',
                position: 'top',
                duration: 3000
              };
              break;
            case 2005:
              params = {
                message: 'Неверный формат email',
                position: 'top',
                duration: 3000
              };
              break;
            default: return console.error(err);
          }

          this._toastCtrl
            .create(params)
            .present();
        }
      );
  }

  signUp() {
    this._navCtrl.push(SignUpPage);
  }

  passwordRecovery() {
    this._navCtrl.push(PasswordRecoveryPage)
  }

}
