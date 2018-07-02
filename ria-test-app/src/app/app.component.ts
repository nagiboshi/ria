import { Component } from '@angular/core';
import { Platform, AlertController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SplashPage } from "./main/pages/splash/splash";
import { FcmService } from './common/services/fcm.service';

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class AppComponent {
  rootPage:any = SplashPage;

  constructor(platform: Platform, private _fcm: FcmService, statusBar: StatusBar, private _toastCtrl:ToastController ,splashScreen: SplashScreen) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      
    });

    this._fcm.onNotification().subscribe( (data)=> {

      const toast = this._toastCtrl.create({
        message:'У Вас новые статьи в рекомендациях.',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
}
    
  
}

