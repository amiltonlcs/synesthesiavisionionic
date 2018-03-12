import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility';
import { WeatherForecastProvider } from '../../providers/weather-forecast/weather-forecast';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { TextToSpeechProvider } from '../../providers/text-to-speech/text-to-speech';
import { Vibration } from '@ionic-native/vibration';

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
	private statusButton: string = 'INICIAR';
	private init: boolean = true;
	private frequencySound: number = 1;
	private frequencySoundMs: number = 100;
	private numberSensor: number = 3;
	private currentSensor: number = 0;
	private distanceSensor: number[] = [this.numberSensor];

	// Vibration Patterns
	private patternOn: number[] = [200, 200, 200, 200, 200]; // Vibrates 3 times
	private patternOff:number[] = [200, 200, 200]; // Vibrates 2 times

	// Delimiters
	private MAX: number = 5; // Maximun frequency for frequencySound
	private MIN: number = 1; // Minimun frequency for frequencySound
	private DMIN: number = 30;
	private DMAX: number = 150;

	// TTS Strings
	private startSonorization: string = 'Iniciando sonorização';
	private pauseSonorization: string = 'Pausando sonorização';
	private upFrequency: string = 'Aumentando frequência';
	private downFrequency: string = 'Diminuindo frequência';
	private maxLimitRange: string = 'Frequência máxima atingida';
	private minLimitRange: string = 'Frequência mínima atingida';

	constructor(public navCtrl: NavController, public navParams: NavParams, 
				public mobileAccessibility: MobileAccessibility, public weatherForecast: WeatherForecastProvider,
				public geolocation: Geolocation, public locationAccuracy: LocationAccuracy,
				public ttsProvider: TextToSpeechProvider, public vibrator: Vibration) {

		// Modificar futuramente para permitir a acessibilidade do usuário
		if(mobileAccessibility.isScreenReaderRunning()){

			mobileAccessibility.speak("Reader está ativo");
			console.log("O reader talkback está ativo");
		} else{

			mobileAccessibility.speak("Reader não está ativo");
			console.log("O reader não está ativo");
		}
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad SynesthesiavisionPage');
	}

	toggleStatusButton(){

		if(this.init){
			this.statusButton = 'PAUSAR';

			this.startSound();

			this.init = false;
		} else {
			this.statusButton = 'INICIAR';

			this.stopSound();

			this.init = true;
		}
	}

	startSound(){
		let frequency_sound = 1 / this.frequencySound * 1000;
		this.frequencySoundMs = frequency_sound; // Hz to s

		this.ttsProvider.speak( this.startSonorization);

		// Implementar ainda
		this.createTimer();

		
		this.vibrator.vibrate(this.patternOn);
	}

	stopSound(){
		this.ttsProvider.speak(this.pauseSonorization);

		this.vibrator.vibrate(this.patternOff);
	}

	//Implementar
	createTimer(){

	}

	// Implementar
	stopTimer(){

	}

	checkWeather(){
		
		// Pegar a latitude do gps
		let lat: number;

		// Pegar a longitude do gps
		let long: number;

		this.locationAccuracy.canRequest().then((canRequest: boolean) => {

			if(canRequest) {

				this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then((success) => {
					
					this.geolocation.getCurrentPosition().then((result) => {
						lat = result.coords.latitude;
						long = result.coords.longitude;
						
						// Utiliza o provider para settar as coordenadas
						this.weatherForecast.setCoordinates(lat.toString(), long.toString());
			
						this.weatherForecast.getWeather();
					}, (err) => {
			
						console.log('Não foi possível localizar sua posição. ' + err.code + ' message: ' + err.message);
					}). catch((err) => {
			
						console.log('Could not handle geolocation Promise.');
					});

				}, (error) => {
					console.log('Error requesting location permissions', error);
				});
			}
			
		});

		// Se o gps não puder pegar a localização
		// Enviar string para ser lida pelo talkBack, 
		//dizendo que o gp está offline

		//se o gps não estiver ligado, enviar a mesma string 
		//para ser lida pelo talkBack que no else if anterior
	}

	increaseFrequency(){

		if(this.frequencySound < this.MAX){

			this.frequencySound += 1;

			this.ttsProvider.speak(this.upFrequency);
		
			if(!this.init){
				this.stopTimer();

				this.init = true;
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

				this.init = true;
				this.toggleStatusButton();
			}
		} else{

			this.ttsProvider.speak(this.minLimitRange);
		}
	}

}
