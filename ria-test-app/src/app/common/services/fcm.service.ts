import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';
import { Platform } from 'ionic-angular';
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
  async saveToken(email) { 

    if (this.platform.is('android')) {
      token = await this.firebaseNative.getToken();
      console.log('~~~~~~~~TOKEN~~~~~~~~~');
      console.log(token);
      const platform = 'android';
      debugger;
      this.api.post('device/register', {email, token, platform});
    } 
  
    if (this.platform.is('ios')) {
      token = await this.firebaseNative.getToken();
      await this.firebaseNative.grantPermission();
    } 
    
    return this.saveTokenToFirestore(token);
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
