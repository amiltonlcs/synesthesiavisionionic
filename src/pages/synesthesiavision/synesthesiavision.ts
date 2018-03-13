import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility';
import { WeatherForecastProvider } from '../../providers/weather-forecast/weather-forecast';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { TextToSpeechProvider } from '../../providers/text-to-speech/text-to-speech';
import { Vibration } from '@ionic-native/vibration';
import { BluetoothProvider } from '../../providers/bluetooth/bluetooth';

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
	private init              : boolean  = true;
	private frequencySound    : number   = 1;
	private frequencySoundMs  : number   = 100;
	private numberSensor      : number   = 3;
	private currentSensor     : number   = 0;
	private distanceSensor    : number[] = [this.numberSensor];
	private canGetWeather     : boolean  = true; // False when weather was previously solicited but hasn't been spoken
	private rx_buffer         : string;

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
	private startCheckWeather : string = 'Previsão do tempo acionada';
	private gpsDeactived      : string = 'GPS desativado, impossível obter localização do usuário';
	private alreadyRequesting : string = 'Processando previsão do tempo'

	constructor(public navCtrl: NavController, public navParams: NavParams, 
				public mobileAccessibility: MobileAccessibility, public weatherForecast: WeatherForecastProvider,
				public geolocation: Geolocation, public locationAccuracy: LocationAccuracy,
				public ttsProvider: TextToSpeechProvider, public vibrator: Vibration,
				public bluetoothProvider: BluetoothProvider) {

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

		this.ttsProvider.speak(this.startSonorization);

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

		this.getBluetoothData();

		if(this.canGetWeather){
			// Aciona o tts para avisar que a previsão do tempo foi acionada
			this.ttsProvider.speak(this.startCheckWeather);

			//Verifica se é possível pegar a localização do usuário
			this.locationAccuracy.canRequest().then((canRequest: boolean) => {

				if(canRequest) {

					//Pede ao usuário para ativar a localização do dispositivo (se não estiver acionada)
					this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then((success) => {
						
						// Busca a localização atual do usuário
						this.geolocation.getCurrentPosition().then((result) => {
							let lat = result.coords.latitude;
							let long = result.coords.longitude;
							
							// Utiliza o provider para settar as coordenadas
							this.weatherForecast.setCoordinates(lat.toString(), long.toString());
				
							//Faz a verificação do tempo
							this.weatherForecast.getWeather();
						}, (err) => {
				
							console.log('Não foi possível localizar sua posição. ' + err.code + ' message: ' + err.message);
						}). catch((err) => {
				
							console.log('Could not handle geolocation Promise.');
						});

					}, (error) => {
						this.ttsProvider.speak(this.gpsDeactived);
						console.log('Error requesting location permissions', error);
					});

				} else {
				}
				
			});
		} else {
			this.ttsProvider.speak(this.alreadyRequesting);
		}

		//verificar se o usuário tem acesso a internet
	}

	increaseFrequency(){

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
	}
	
	/**
     * Handle the data which comes through Bluetooth socket.
     */
	private getBluetoothData(){
		
		this.rx_buffer = this.bluetoothProvider.getData();
		
	}

	/**
     * Send complete messages from the rx_buffer to the read handler.
     */
    private parseMessages() {

        // Find the first delimiter in the buffer
        let inx = this.rx_buffer.indexOf(this.DELIMITER);

        // If there is none, exit
        if (inx == -1)
            return;

        // Get the complete message
        let s = this.rx_buffer.substring(0, inx);

        // Remove the message from the buffer
        this.rx_buffer = this.rx_buffer.substring(inx + 1);

		
		console.log('mensagem: ' + s)

        // Look for more complete messages
        this.parseMessages();
    }

}
