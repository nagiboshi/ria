import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';
import { Platform, AlertController, ToastController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { ApiService } from './api.service';

@Injectable()
export class FcmService {

  constructor(
    public firebaseNative: Firebase,
    public afs: AngularFirestore,
    private platform: Platform,
    private api: ApiService,
    private _toastCtrl : ToastController,
  ) {}

  // Get permission from the user
  public registerToken(email):Promise<string>  { 
    let token =  '';
    const promise = new Promise<string>((resolve, reject)=>{
     
      if (this.platform.is('android')) {
        this.firebaseNative.getToken().then((commingToken) => { 
          token = commingToken;
          const platform = 'android';
          this.api.post('device/register', {email, token, platform}).subscribe((result)=>{
            resolve(result);
          });
        }).catch((e)=> {
          reject(e);
        });
      } 
    
      if (this.platform.is('ios')) {
        let token = '';
        this.firebaseNative.getToken().then((commingToken) => { 
          token = commingToken;
          const platform = 'ios';
          this.api.post('device/register', {email, token, platform});
          this.firebaseNative.grantPermission();
        }).catch((e)=> {
          console.error(`Not able to take token for ${email}`, e);
        });
      } 
    });
    return promise;
  }

  // Listen to incoming FCM messages
  listenToNotifications(topic) {
    return this.firebaseNative.subscribe(topic);
  }
  

}
