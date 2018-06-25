import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SplashPage } from "./main/pages/splash/splash";
import { Push, PushObject, PushOptions} from '@ionic-native/push';

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class AppComponent {
  rootPage:any = SplashPage;

  constructor(platform: Platform, statusBar: StatusBar, private alertCtrl:AlertController ,splashScreen: SplashScreen, public push: Push) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
    pushsetup() {
      const options: PushOptions = {
       android: {
           senderID: '161459370733'
       },
       ios: {
           alert: 'true',
           badge: true,
           sound: 'false'
       },
       windows: {}
    };
  
    const pushObject: PushObject = this.push.init(options);
  
    pushObject.on('notification').subscribe((notification: any) => {
      if (notification.additionalData.foreground) {
        let youralert = this.alertCtrl.create({
          title: 'New Push notification',
          message: notification.message
        });
        youralert.present();
      }
    });
  
    pushObject.on('registration').subscribe((registration: any) => {
       //do whatever you want with the registration ID
    });
  
    pushObject.on('error').subscribe(error => alert('Error with Push plugin' + error));
    }
  
}

