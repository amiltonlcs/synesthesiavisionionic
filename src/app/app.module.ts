import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '@angular/common/http';

// Pages imports 
import { SynesthesiavisionPage } from '../pages/synesthesiavision/synesthesiavision';
import { BluetoothConnectionVerifyPage } from "../pages/bluetooth-connection-verify/bluetooth-connection-verify";

// Plugins imports
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { MobileAccessibility } from "@ionic-native/mobile-accessibility";
import { NativeStorage } from "@ionic-native/native-storage";
import { TextToSpeech } from "@ionic-native/text-to-speech";
import { Geolocation } from "@ionic-native/geolocation";
import { AndroidPermissions } from "@ionic-native/android-permissions";
import { LocationAccuracy } from "@ionic-native/location-accuracy";
import { HTTP } from '@ionic-native/http';
import { Vibration } from "@ionic-native/vibration";


// Services imports
import { AudioProvider } from '../providers/audio/audio';
import { BluetoothProvider } from '../providers/bluetooth/bluetooth';
import { WeatherForecastProvider } from '../providers/weather-forecast/weather-forecast';
import { TextToSpeechProvider } from '../providers/text-to-speech/text-to-speech';

// As novas páginas vão no declaragions e no entryComponents
@NgModule({
	declarations: [
		MyApp,

		SynesthesiavisionPage,
		BluetoothConnectionVerifyPage
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		IonicModule.forRoot(MyApp)
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,

		SynesthesiavisionPage,
		BluetoothConnectionVerifyPage
	],
	providers: [
		StatusBar,
		SplashScreen,
		{provide: ErrorHandler, useClass: IonicErrorHandler},
		
		BluetoothSerial,
		MobileAccessibility,
		NativeStorage,
		TextToSpeech,
		Geolocation,
		AndroidPermissions,
		LocationAccuracy,
		HTTP,
		Vibration,

		WeatherForecastProvider,
		BluetoothProvider,
		TextToSpeechProvider,
		AudioProvider
	]
})
export class AppModule {}
