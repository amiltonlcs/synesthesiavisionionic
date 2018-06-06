import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility';
import { WeatherForecastProvider } from '../../providers/weather-forecast/weather-forecast';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { TextToSpeechProvider } from '../../providers/text-to-speech/text-to-speech';
import { Vibration } from '@ionic-native/vibration';
import { BluetoothProvider } from '../../providers/bluetooth/bluetooth';
import { AudioProvider } from '../../providers/audio/audio';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { AudioProvider2 } from '../sound-tracker/audio';
import { BusIntegrationProvider } from '../../providers/bus-integration/bus-integration';
import { HorariosPage } from '../horarios/horarios';
import { PermissionProvider } from '../../providers/permission/permission';
import { AudioProvider3} from '../sound-tracker/audio-Promises';

/**
 * Generated class for the SynesthesiavisionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
	selector: 'page-synesthesiavision',
	templateUrl: 'synesthesiavision.html',
})
export class SynesthesiavisionPage {

	// Variables
	public statusButton           : string   = 'INICIAR';
	private init                  : boolean  = true; // True when is not playing, False when is playing
	private frequencySound        : number   = 1;
	private frequencySoundMs      : number   = 100;
	// private numberSensor       : number   = 3;
	// private currentSensor      : number   = 0;
	// private distanceSensor     : number[] = [this.numberSensor];
	// private intervalo          : any; // To execute the sound in loop
	// private volume			      : number = 50;
	private bluetoothSubscription : any;

	// Vibration Patterns
	private patternOn             : number[] = [200, 200, 200, 200, 200]; // Vibrates 3 times
	private patternOff            : number[] = [200, 200, 200]; // Vibrates 2 times

	// Delimiters
	private MAX                   : number = 5; // Maximun frequency for frequencySound
	private MIN                   : number = 1; // Minimun frequency for frequencySound

	// TTS Strings
	private startSonorization     : string = 'Iniciando sonorização';
	private pauseSonorization     : string = 'Pausando sonorização';
	private upFrequency           : string = 'Aumentando frequência';
	private downFrequency         : string = 'Diminuindo frequência';
	private maxLimitRange         : string = 'Frequência máxima atingida';
	private minLimitRange         : string = 'Frequência mínima atingida';

	//Modificar
	private variaveis                     : any = { side: Number, sound_duration: Number, track: String, frequencia: Number };

	constructor(public navCtrl: NavController, public navParams: NavParams, 
				public mobileAccessibility: MobileAccessibility, public weatherForecastProvider: WeatherForecastProvider,
				public geolocation: Geolocation, public locationAccuracy: LocationAccuracy,
				public ttsProvider: TextToSpeechProvider, public vibrator: Vibration,
				public bluetoothProvider: BluetoothProvider, public bluetoothSerial: BluetoothSerial,
				public audioProvider: AudioProvider, public audioProvider22: AudioProvider2,public audioProvider2: AudioProvider3,
				public busIntegration : BusIntegrationProvider, public permissionsProvider: PermissionProvider) {

		this.variaveis.side = 1;
		this.variaveis.sound_duration = 0.8;
		this.variaveis.track = 'assets/sounds/bu1seg.ogg';
		this.variaveis.frequencia = 1;
	}

	ionViewDidLoad() {
		this.permissionsProvider.getPermissions();

		this.bluetoothSubscription = this.getBluetoothData();
	}

	ionViewWillLeave(){
		this.bluetoothSubscription.unsubscribe();
	}

	ionViewWillEnter(){
		this.bluetoothSubscription = this.getBluetoothData();
	}

	toggleStatusButton(){
		if(this.init){

			this.statusButton = 'PAUSAR';
			this.init = false;

            this.playSound();
		} else {

			this.statusButton = 'INICIAR';
			this.init = true;

            this.stopSound();
		}
	}

	playSound(){
		this.ttsProvider.speak(this.startSonorization);

		this.playAudio();
		
		this.vibrator.vibrate(this.patternOn);
	}

	stopSound(){
		this.ttsProvider.speak(this.pauseSonorization);
		this.stopTimer();
		this.vibrator.vibrate(this.patternOff);
	}

	stopTimer(){
		this.audioProvider2.stopRunningSound();
	}

	playAudio(){
		this.audioProvider2.playSound();
	}

	/**
	 * Uses the weatherForecastProvider to verify the user's Position 
	 * and it's weather.
	 */
	checkWeather(){
		this.weatherForecastProvider.startChecking();
	}

	increaseFrequency(){
		// this.audioProvider2.atualizarSensor(this.distanceSensor, this.variaveis);
		if(this.frequencySound < this.MAX){

			this.frequencySound += 1;

			this.ttsProvider.speak(this.upFrequency);
		
			if(!this.init){
				this.stopTimer();

				this.toggleStatusButton();
			}

		} else{

			this.ttsProvider.speak(this.maxLimitRange);
		}
	}

	decreaseFrequency(){
		
		if(this.frequencySound > this.MIN){

			this.frequencySound -= 1;
			
			this.ttsProvider.speak(this.downFrequency);
			
			if(!this.init){
				this.stopTimer();

				this.toggleStatusButton();
			}
		} else{

			this.ttsProvider.speak(this.minLimitRange);
		}
	}
	
	/**
     * Handle the data which comes through Bluetooth socket.
     */
	private getBluetoothData(){
		return this.bluetoothProvider.getBluetoothData().subscribe((data) => {

			this.bluetoothProvider.processData(data).then((result) => {
				
				if(!result.includes('true')){

					if(result.includes('getweather')){
						this.weatherForecastProvider.startChecking();
					} else if(result.includes('luminosidade')){
						this.speakLuminosity(data);
					} else if(result.includes('onibus')){
						this.getParadaProxima();
					}
				}

			}) ;
		});
	}

	// increaseVolume(){
		
	// 	if(this.volume < 100){
	// 		this.volume+=10;
	// 		this.audioProvider2.changeVolume(this.volume);
	// 	}
		
	// 	console.log(this.volume);	
	// }

	// descreaseVolume(){

	// 	if(this.volume > 0){
	// 		this.volume-=10;
	// 		this.audioProvider2.changeVolume(this.volume);
	// 	}

	// 	console.log(this.volume);
	// }

	// muteVolume(){

	// 	this.volume = 0;
	// 	this.audioProvider2.changeVolume(0);
	// }

	getParadaProxima(){
		this.navCtrl.push(HorariosPage);
	}

	speakLuminosity(dataBuffer){
		this.bluetoothSubscription.unsubscribe();
		
		if(dataBuffer.includes('Acesa')){
			this.ttsProvider.speak('O ambiente está claro.');
		} else {
			this.ttsProvider.speak('O ambiente está escuro.');
		}

		this.ionViewWillEnter();
	}
}
