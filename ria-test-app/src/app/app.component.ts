import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SplashPage } from "./main/pages/splash/splash";

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class AppComponent {
  rootPage:any = SplashPage;

  constructor(platform: Platform, statusBar: StatusBar, private alertCtrl:AlertController ,splashScreen: SplashScreen) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
}
    
  
}

