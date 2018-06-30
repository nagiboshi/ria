import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { AppComponent } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IonicStorageModule } from "@ionic/storage";
import { MainModule } from './main/main.module';
import { CommonModule } from "./common/common.module";
import { FcmService } from './common/services/fcm.service';
import { Firebase } from '@ionic-native/firebase';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

export const firebase = {
  apiKey: "AIzaSyCw6DS3FJZPWcGP6m_UDPHRCEfY4XFpSo8",
  authDomain: "riatest-ec40b.firebaseapp.com",
  databaseURL: "https://riatest-ec40b.firebaseio.com",
  projectId: "riatest-ec40b",
  storageBucket: "riatest-ec40b.appspot.com",
  messagingSenderId: "383883584635",
};

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent),
    IonicStorageModule.forRoot({
      name: 'ria-db',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    AngularFireModule.initializeApp(firebase), 
    AngularFirestoreModule,
    MainModule,
    CommonModule,
  ],
  bootstrap: [ IonicApp ],
  entryComponents: [ AppComponent ],
  providers: [
    StatusBar,
    SplashScreen,
    Firebase,
    File,
    FcmService,
    FileOpener,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {}
