import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { TextToSpeech } from '@ionic-native/text-to-speech';

/*
  Generated class for the WeatherForecastProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WeatherForecastProvider {

	latitude: string;
	longitude: string;

	constructor(public http: HttpClient, public alertCtrl: AlertController, public tts: TextToSpeech) {
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
		let Currentlang = 'pt';

		let resultado: any;

		this.http.get(url, {params: {lat: this.latitude, lon: this.longitude, lang: Currentlang, appid: openWeatherAppKey}, responseType: 'json'})
			.map(res => {
				resultado = res;
			})	
			.subscribe((success)=>{

				this.tts.speak({
					text: resultado.weather[0].description,
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
			})
	}
}
