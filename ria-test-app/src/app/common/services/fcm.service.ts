import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';
import { Platform, AlertController, ToastController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { ApiService } from './api.service';

@Injectable()
export class FcmService {
  private token;
  constructor(
    public firebaseNative: Firebase,
    public afs: AngularFirestore,
    private platform: Platform,
    private api: ApiService,
    private _toastCtrl : ToastController,
  ) {
  }


  public onTokenRefresh(email){
    this.firebaseNative.onTokenRefresh().subscribe((newToken) => {
      this.token = newToken;
      this.registerToken(email);
    });
  
  }

  public onNotification() {
  return this.firebaseNative.onNotificationOpen(); 
  }

  private saveToBackend(email, commingToken, platform):Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {
      this.api.post('device/register', {email:email, token:commingToken, platform:platform}).subscribe((result)=>{
        resolve(result);
      });
    });
    return promise;
  }
  // Get permission from the user
  public registerToken(email):Promise<string>  { 
    const promise = new Promise<string>((resolve, reject)=>{
     
      if (this.platform.is('android')) {
        this.firebaseNative.getToken().then((commingToken) => { 
          this.token = commingToken;
          const platform = 'android';
          this.saveToBackend(email, this.token, platform).then(() => {
            resolve();
          });
        }).catch((e)=> {
          reject(e);
        });
      } 
    
      if (this.platform.is('ios')) {
        this.firebaseNative.getToken().then((commingToken) => { 
          this.token = commingToken;
          const platform = 'ios';
          this.firebaseNative.grantPermission();
          this.saveToBackend(email, this.token, platform).then(() => { 
            resolve();
          })
        }).catch((e)=> {
          console.error(`Not able to take token for ${email}`, e);
          reject(e);
        });
      } 
    });
    return promise;
  }

  stopListeningNotifications(topic) {
    return this.firebaseNative.unsubscribe(topic);
  }

  // Listen to incoming FCM messages
  listenToNotifications(topic) {
    return this.firebaseNative.subscribe(topic);
  }
  

}
