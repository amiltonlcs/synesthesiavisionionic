import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility';
import { WeatherForecastProvider } from '../../providers/weather-forecast/weather-forecast';
import { Geolocation } from '@ionic-native/geolocation';

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

	statusButton: string = 'INICIAR';
	statusButtonOn: boolean = false;

	constructor(public navCtrl: NavController, public navParams: NavParams, 
				public mobileAccessibility: MobileAccessibility, public weatherForecast: WeatherForecastProvider,
				public geolocation: Geolocation) {

		//  Modificar futuramente para permitir a acessibilidade do usuário
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

		if(!this.statusButtonOn){
			this.statusButton = 'PAUSAR';
			this.statusButtonOn = true;
		} else {
			this.statusButton = 'INICIAR';
			this.statusButtonOn = false;
		}
	}

	checkWeather(){
		
		// Pegar a latitude do gps
		let lat: number;

		// Pegar a longitude do gps
		let long: number;

		// Verificar se gps está ligado, e
		// se pode pegar a localização

		//if(this.getPermissions()){
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
		//}
		// Se o gps não puder pegar a localização
		// Enviar string para ser lida pelo talkBack, 
		//dizendo que o gp está offline

		//se o gps não estiver ligado, enviar a mesma string 
		//para ser lida pelo talkBack que no else if anterior
	}

	increaseFrequency(){

	}

	decreaseFrequency(){
		
	}

}
