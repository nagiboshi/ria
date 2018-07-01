import { Component, Input } from '@angular/core';
import {NavController, ToastController, Platform} from "ionic-angular";
import { SignUpPage } from "../sign-up/sign-up";
import { PasswordRecoveryPage } from "../password-recovery/password-recovery";
import { MainPage } from "../../main";
import { AuthService } from "../../../common/services/auth.service";
import {FcmService} from '../../../common/services/fcm.service';
import { tap } from 'rxjs/operators';
import { IUserModel } from '../../../common/models/user';

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
    private _platform: Platform,
    private _toastCtrl: ToastController,
    private _fcm: FcmService
  ) {}

  signIn() {
    


    if (!this.email || !this.password) {
      return;
    }

    this._authService
      .signIn(this.email, this.password)
      .subscribe(
        () => {

            this._authService.getUser().subscribe((user:IUserModel) => { 
            
              // 
              this._toastCtrl.create({
                message: `Push enabled : ${user.pushByPhone} ,platform is browser :? ${this._platform.is('browser')}`,
                duration: 10000
              }).present();
            //

                if( user.pushByPhone && !this._platform.is('browser')) {
                  this._fcm.registerToken(this.email).then((response) => { 

                    this._fcm.listenToNotifications("articles").then((message)=>{

                   
                                          // show a toast
                        this._toastCtrl.create({
                                            message: 'yo',
                                            duration: 3000
                                          }).present();
                                      //.subscribe();
                    });
                      // Listen to incoming messages
                      // this._fcm.listenToArticles().then((result ) => {
                      //     tap( msg => {
                      //     // show a toast
                      //     const toast = this._toastCtrl.create({
                      //       message: result,
                      //       duration: 10000
                      //     }).present();
                      //     toast.
                      //     })
                     
                      //   });
                  });
                }
                });
                      

           
          this._navCtrl.setRoot(MainPage);
        },
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
