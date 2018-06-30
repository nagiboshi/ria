import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SplashPage } from "./main/pages/splash/splash";
import {FcmService} from './common/services/fcm.service';
import { ToastController } from 'ionic-angular';
import { tap } from 'rxjs/operators';
@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class AppComponent {
  rootPage:any = SplashPage;

  constructor(platform: Platform, statusBar: StatusBar, toastCtrl: ToastController, private alertCtrl:AlertController ,splashScreen: SplashScreen, public fcm: FcmService) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
}
    
  
}

