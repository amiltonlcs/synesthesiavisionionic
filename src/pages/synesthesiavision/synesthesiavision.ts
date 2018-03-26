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
	private statusButton      : string   = 'INICIAR';
	private init              : boolean  = true; // True when is not playing, False when is playing
	private frequencySound    : number   = 1;
	private frequencySoundMs  : number   = 100;
	private numberSensor      : number   = 3;
	private currentSensor     : number   = 0;
	private distanceSensor    : number[] = [this.numberSensor];
	private rx_buffer         : string;
	private intervalo         : any; // To execute the sound in loop

	// Vibration Patterns
	private patternOn         : number[] = [200, 200, 200, 200, 200]; // Vibrates 3 times
	private patternOff        : number[] = [200, 200, 200]; // Vibrates 2 times

	// Delimiters
    private DELIMITER         : string = '\n';
	private MAX               : number = 5; // Maximun frequency for frequencySound
	private MIN               : number = 1; // Minimun frequency for frequencySound
	private DMIN              : number = 30;
	private DMAX              : number = 150;

	// TTS Strings
	private startSonorization : string = 'Iniciando sonorização';
	private pauseSonorization : string = 'Pausando sonorização';
	private upFrequency       : string = 'Aumentando frequência';
	private downFrequency     : string = 'Diminuindo frequência';
	private maxLimitRange     : string = 'Frequência máxima atingida';
	private minLimitRange     : string = 'Frequência mínima atingida';

	//Modificar
	variaveis: any = { side: Number, sound_duration: Number, track: String, frequencia: Number };

	public tracks: any = [
		{
		   	artist  : 'Time Synesthesia',
			name    : 'Confirmar bluetooth',
		   	track   : 'assets/sounds/bluetooth_confirma.ogg'
		},
		{
			artist  : 'Time Synesthesia',
		   	name    : 'Finalizar aplicativo',
		   	track   : 'assets/sounds/finalizar.ogg'
		}, {
			artist  : 'Time Synesthesia',
			name    : 'Sonorização dos sensores',
			track   : 'assets/sounds/bu.ogg' 
		}
	];

	constructor(public navCtrl: NavController, public navParams: NavParams, 
				public mobileAccessibility: MobileAccessibility, public weatherForecastProvider: WeatherForecastProvider,
				public geolocation: Geolocation, public locationAccuracy: LocationAccuracy,
				public ttsProvider: TextToSpeechProvider, public vibrator: Vibration,
				public bluetoothProvider: BluetoothProvider, public bluetoothSerial: BluetoothSerial,
				public audioProvider: AudioProvider, public audioProvider2: AudioProvider2) {

		// Modificar futuramente para permitir a acessibilidade do usuário
		// if(mobileAccessibility.isScreenReaderRunning()){

		// 	mobileAccessibility.speak("Reader está ativo");
		// 	console.log("O reader talkback está ativo");
		// } else{

		// 	mobileAccessibility.speak("Reader não está ativo");
		// 	console.log("O reader não está ativo");
		// }

		this.variaveis.side = 1;
		this.variaveis.sound_duration = 0.8;
		this.variaveis.track = 'assets/sounds/bu.ogg';
		this.variaveis.frequencia = 1;
	}

	ionViewDidLoad() {
		this.getBluetoothData();
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
		let frequency_sound = 1 / this.frequencySound * 1000;
		this.frequencySoundMs = frequency_sound; // Hz to s

		this.ttsProvider.speak(this.startSonorization);

		// Implementar ainda
		this.createTimer();

		
		this.vibrator.vibrate(this.patternOn);
	}

	stopSound(){
		this.ttsProvider.speak(this.pauseSonorization);
		this.stopTimer();
		this.vibrator.vibrate(this.patternOff);
	}

	//Implementar
	createTimer(){

		// this.audioProvider.loadSound('assets/sounds/bu.ogg');
		this.playAudio();
		this.currentSensor++;
		this.currentSensor %= 3;
	}

	// Implementar
	stopTimer(){
		clearInterval(this.intervalo);
	}

	playAudio(){

		this.intervalo = setInterval(() => {
			this.audioProvider2.atualizarSensor(this.distanceSensor, this.variaveis);
		}, 1500);
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

	private getMinDistance(input: number[]): number[] {

        if(this.distanceSensor[0] < this.distanceSensor[1]) {

            if (this.distanceSensor[0] < this.distanceSensor[2]) {
				
				input[0] = this.distanceSensor[0];
                input[1] = 0;
            } else{
				
				input[0] = this.distanceSensor[2];
                input[1] = 2;
            }
        } else if (this.distanceSensor[1] < this.distanceSensor[2]) {
			
			input[0] = this.distanceSensor[1];
            input[1] = 1;
        } else {
			
			input[0] = this.distanceSensor[2];
            input[1] = 2;
		}
		
        return input;
	}
	
	/**
     * Saves a distance which comes from the glass.
     *
     * @param sensor   The sensor which value will be saved.
     * @param distance Save specified sensors distance.
     */
    private saveData(sensor: string, distance: number) {

        if(distance < this.DMAX) {
            if (sensor == 'a') {
                this.distanceSensor[2] = distance;
            }
            //Front
            else if (sensor == 'b') {
                this.distanceSensor[1] = distance;
            }
            //Left
            else if (sensor == 'c') {
                this.distanceSensor[0] = distance;
            }
		}


		// setTimeout(() => {
		// 	this.audioProvider2.atualizarSensor(this.distanceSensor, this.variaveis);
		// }, 1000);
		
	}
	
	/**
     * Handle the data which comes through Bluetooth socket.
     */
	private getBluetoothData(){
		
		this.bluetoothSerial.subscribe(this.DELIMITER).subscribe((data) => {
			this.rx_buffer = data;

			if(this.rx_buffer.includes('getweather')){
				this.checkWeather();
				return;
			}

			console.log('Resultado: ,' + this.rx_buffer + ',');
			

			let inx = this.rx_buffer.indexOf(this.DELIMITER);
	
			//Get the first character responsable for indentifier the sensor
			let sensor1 = this.rx_buffer.substring(0, 1);
			
			//Get the distance after character
			let distance = "";
			
			try{
				distance = this.rx_buffer.substring(1, inx);
			} catch(err) {
				console.log('Error: ' + err);
			}
			
			//Get the primary character at message, which corresponds to sensor which has sent the distance
			let sensor = sensor1.charAt(0);
	
			//If have any data, it will save.
			//Modificar 
			if(typeof sensor === "string" && typeof distance.charAt(0) === "string") {
				if (!this.isEmpty(distance) && distance.search("DISCONNECTED") == -1) {
					this.saveData(sensor, Number(distance));
				}
			}
		}, (err) => {

		});
		
	}

	/**
	 * Implementation of method isEmpty. Receives a string data and verify it's length
	 * if it's equals 0 returns true otherwise, returns false;
	 * 
	 * @param data String to check it's length
	 */
	private isEmpty(data: string): boolean{
		if(data.length == 0){
			return true;
		} else {
			return false;
		}
	}

}
