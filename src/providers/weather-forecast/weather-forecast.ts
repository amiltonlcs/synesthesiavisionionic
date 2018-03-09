import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { HTTP } from '@ionic-native/http';

/*
  Generated class for the WeatherForecastProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WeatherForecastProvider {

	latitude: string;
	longitude: string;

	constructor(public http: HTTP, public alertCtrl: AlertController, public tts: TextToSpeech) {
		console.log('Hello WeatherForecastProvider Provider');
	}

	/**
     * Set the coordinates which come from the GPSTracker
     *
     * @param      latitude   The latitude
     * @param      longitude  The longitude
     */
	setCoordinates(latitude: string, longitude: string){
		this.latitude = latitude;
		this.longitude = longitude;
	}

	/**
     * Gets the weather on specified location.
     *
     * @return     The weather.
     */
	getWeather(){
		//Não existe mais? Falar com Michael
		//let url = 'http://sweetglass.azurewebsites.net/weather';
		//Trocar a key 
		let openWeatherAppKey = '457dbe6ae9995dbadf75c7a34f1d8e03';
		let url = 'http://api.openweathermap.org/data/2.5/weather?lang=pt';
		let Currentlang = 'pt'; // Linguagem da descrição em portugues
		let unidade = 'metric'; // Unidade em  ° C

		let resultado: any;

		this.http.setRequestTimeout(15);
		this.http.get(url, {lat: this.latitude, lon: this.longitude, lang: Currentlang, units: unidade, appid: openWeatherAppKey}, {responseType: 'json'}).then((success) => {

			resultado = JSON.parse(success.data);
			console.log(resultado.weather[0]);
			
			this.tts.speak({
				text: resultado.weather[0].description + ' e temperatura de ' + resultado.main.temp + ' °C',
				locale: 'pt-BR',
				rate: 0.75
			}).then((success) => {
				console.log(success);
			}, (err) => {
				console.log(err)
			});

			console.log('Resultado: ' + resultado.weather[0].main);				
				
		}, (err) => {

			let alert = this.alertCtrl.create({
				title: 'sucesso',
				message: err,
				buttons: ['OK']
			});
	
			alert.present();

			console.log('ERROR: ' + err);
		});
	}
}
