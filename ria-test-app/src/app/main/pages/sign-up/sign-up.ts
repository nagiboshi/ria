import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from "../../../common/services/auth.service";
import {NavController, ToastController, ViewController} from "ionic-angular";
import { MainPage } from "../../main";
import { SignInPage } from "../sign-in/sign-in";

@Component({
  selector: 'sign-up',
  templateUrl: 'sign-up.html'
})

export class SignUpPage implements OnInit {

  @Input() company: string;
  @Input() email: string;
  @Input() password: string;

  constructor(
    private _authService: AuthService,
    private _navCtrl: NavController,
    private _viewCtrl: ViewController,
    private _toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this._viewCtrl.setBackButtonText('Вход');
  }

  signUp() {
    this._authService
      .signUp(this.company, this.email, this.password)
      .subscribe(
        () => this._navCtrl.setRoot(MainPage),
        err => {
          let params = null;

          switch (err.code) {
            case 2003:
              params = {
                message: 'Пользователь с таким email уже существует',
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
            case 5001:
              params = {
                message: 'Компания не найдена',
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
