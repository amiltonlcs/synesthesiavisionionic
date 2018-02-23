import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

// Adicionando as novas páginas criadas
import { WelcomePage } from '../pages/welcome/welcome';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { SynesthesiavisionPage } from '../pages/synesthesiavision/synesthesiavision';
import { BluetoothConnectionVerifyPage } from "../pages/bluetooth-connection-verify/bluetooth-connection-verify";


// Adicionando os providers 
import { MobileAccessibility } from "@ionic-native/mobile-accessibility";
import {BluetoothSerial} from '@ionic-native/bluetooth-serial';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// As novas páginas vão no declaragions e no entryComponents
@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,

    WelcomePage,
    LoginPage,
    SignupPage,
    SynesthesiavisionPage,
    BluetoothConnectionVerifyPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,

    WelcomePage,
    LoginPage,
    SignupPage,
    SynesthesiavisionPage,
    BluetoothConnectionVerifyPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BluetoothSerial,
    MobileAccessibility,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
