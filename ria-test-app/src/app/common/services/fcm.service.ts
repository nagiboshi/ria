import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';
import { Platform, AlertController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { ApiService } from './api.service';

@Injectable()
export class FcmService {

  constructor(
    public firebaseNative: Firebase,
    public afs: AngularFirestore,
    private platform: Platform,
    private api: ApiService
  ) {}

  // Get permission from the user
  public saveToken(email):Promise<string>  { 
    let token =  '';
    const promise = new Promise<string>((resolve, reject)=>{
      if (this.platform.is('android')) {
        this.firebaseNative.getToken().then((commingToken) => { 
          token = commingToken;
          console.log('~~~~~~~~TOKEN~~~~~~~~~');
          console.log(token);
          const platform = 'android';
          this.api.post('device/register', {email, token, platform}).subscribe((result)=>{
           
            console.log(`email ${email} with token ${token} has been registered on platform ${platform}`);
            console.log(result);
            resolve(result);
          });
        }).catch((e)=> {
          console.error(`Not able to take token for ${email}`, e);
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
    
    
    // return this.saveTokenToFirestore(token);
  }

  // Save the token to firestore
  private saveTokenToFirestore(token) {
    if (!token) return;

  const devicesRef = this.afs.collection('devices')

  const docData = { 
    token,
    userId: 'testUser',
  }

  return devicesRef.doc(token).set(docData)
  }

  // Listen to incoming FCM messages
  listenToNotifications() {
    return this.firebaseNative.onNotificationOpen();
  }

}