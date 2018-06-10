import { Component, Input, OnInit } from '@angular/core';
import {
  NavController, ToastController, ViewController
} from "ionic-angular";
import { UserService } from "../../../common/services/user.service";

@Component({
  selector: 'recovery-pass-page',
  templateUrl: 'password-recovery.html'
})

export class PasswordRecoveryPage implements OnInit {

  @Input() email: string;

  constructor(
    private _userService: UserService,
    private _navCtrl: NavController,
    private _toastCtrl: ToastController,
    private _view: ViewController
  ) {}

  ngOnInit() {
    this._view.setBackButtonText('Вход');
  }

  passwordRecovery() {
    if (!this.email) {
      return;
    }

    this._userService
      .passwordRecovery(this.email)
      .subscribe(
        () => {
          this._toastCtrl
            .create({
              message: 'На Ваш почтовый ящик было отправлено письмо для сброса пароля',
              position: 'top',
              duration: 3000
            })
            .present();

          this._navCtrl.pop();
        },
        err => {
          let params = null;

          switch(err.code) {
            case 2001:
              params = {
                message: 'Пользователь с таким email не найден',
                position: 'top',
                duration: 3000
              };
              break;
            case 2005:
              params = {
                message: 'Неверный email',
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

}
