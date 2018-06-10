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
    MainModule,
    CommonModule,
  ],
  bootstrap: [ IonicApp ],
  entryComponents: [ AppComponent ],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    FileOpener,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {}
