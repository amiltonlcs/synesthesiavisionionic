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
	public statusButton       : string   = 'INICIAR';
	private init              : boolean  = true; // True when is not playing, False when is playing
	private frequencySound    : number   = 1;
	private frequencySoundMs  : number   = 100;
	private numberSensor      : number   = 3;
	private currentSensor     : number   = 0;
	private distanceSensor    : number[] = [this.numberSensor];
	private intervalo         : any; // To execute the sound in loop
	private volume			  : number = 50;

	// Vibration Patterns
	private patternOn         : number[] = [200, 200, 200, 200, 200]; // Vibrates 3 times
	private patternOff        : number[] = [200, 200, 200]; // Vibrates 2 times

	// Delimiters
	private MAX               : number = 5; // Maximun frequency for frequencySound
	private MIN               : number = 1; // Minimun frequency for frequencySound

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
				public audioProvider: AudioProvider, public audioProvider2: AudioProvider2,
				public busIntegration : BusIntegrationProvider, public permissionsProvider: PermissionProvider) {

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
		this.permissionsProvider.getPermissions();
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
		this.audioProvider2.stopRunningSound();
	}

	playAudio(){

		this.audioProvider2.playSound();

		// this.intervalo = setInterval(() => {

		// 	// Como o método de salvar a distancia do sensor saiu da classe do synesthesiavision
		// 	// É necessário atualizar o distanceSensor antes de executar o som.
		// 	this.distanceSensor = this.bluetoothProvider.getDistanceSensor();

		// 	this.audioProvider2.atualizarSensor(this.distanceSensor, this.variaveis);
		// }, this.calcularFrequencia(this.getDistanceMin()));
	}
	
	calcularFrequencia(distancia) {
		
		var frequencia;
		var frequencia_MIN = 1300;
		var frequencia_MAX = 4000;
		var distancia_MIN = 30;
	
		if (distancia >= distancia_MIN) {
				frequencia = distancia * 18;
		} else {
				frequencia = frequencia_MIN;
		}
	
		if (frequencia > frequencia_MAX) {
				frequencia = frequencia_MAX;
		}
	
		console.log("frequencia atual: " + frequencia)
		return frequencia;
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

	// private getDistanceMin(){
	// 	if (this.distanceSensor[0] < this.distanceSensor[1] && this.distanceSensor[0] < this.distanceSensor[2]) {

	// 		return this.distanceSensor[0];

	// 	} else if (this.distanceSensor[1] < this.distanceSensor[0] && this.distanceSensor[1] < this.distanceSensor[2]) {

	// 		return this.distanceSensor[1];

	// 	} else if (this.distanceSensor[2] < this.distanceSensor[0] && this.distanceSensor[2] < this.distanceSensor[1]) {

	// 		return this.distanceSensor[2];
	// 	}
	// }
	// private getMinDistance(input: number[]): number[] {

    //     if(this.distanceSensor[0] < this.distanceSensor[1]) {

    //         if (this.distanceSensor[0] < this.distanceSensor[2]) {
				
	// 			input[0] = this.distanceSensor[0];
    //             input[1] = 0;
    //         } else{
				
	// 			input[0] = this.distanceSensor[2];
    //             input[1] = 2;
    //         }
    //     } else if (this.distanceSensor[1] < this.distanceSensor[2]) {
			
	// 		input[0] = this.distanceSensor[1];
    //         input[1] = 1;
    //     } else {
			
	// 		input[0] = this.distanceSensor[2];
    //         input[1] = 2;
	// 	}
		
    //     return input;
	// }
	
	/**
     * Handle the data which comes through Bluetooth socket.
     */
	private getBluetoothData(){
		this.bluetoothProvider.getBluetoothData();
	}

	increaseVolume(){
		
		if(this.volume < 100){
			this.volume+=10;
			this.audioProvider2.changeVolume(this.volume);
		}
		
		console.log(this.volume);	
	}

	descreaseVolume(){

		if(this.volume > 0){
			this.volume-=10;
			this.audioProvider2.changeVolume(this.volume);
		}

		console.log(this.volume);
	}

	muteVolume(){

		this.volume = 0;
		this.audioProvider2.changeVolume(0);
	}



	getParadas(){
	
		return this.busIntegration.startChecking().then((paradas) => {
		});
	}

	getLinhas(){
		this.busIntegration.getLinhas();
	}

	getEstruturaLinha(){

		// Etiqueta da linha BARRO / MACAXEIRA (BR-101)
		// Id é 447
		let etiquetaLinha: string = '207';

		this.busIntegration.getEstruturaLinha(etiquetaLinha);
	}

	// Obs.: Não retorna nada
	getVeiculosLinha(){

		// Etiqueta da linha BARRO / MACAXEIRA (BR-101)
		// Id é 447
		let etiquetaLinha: string = '207';

		this.busIntegration.getVeiculosLinha(etiquetaLinha);
	}

	getLinhasParada(){

		// Etiqueta da parada na frente no IFPE
		let etiquetaEstacao: string = '80307';

		this.busIntegration.getLinhasParada(etiquetaEstacao);
	}

	getParadasZona(){
		this.busIntegration.getParadasZona();
	}

	getHorarioParadaLinha(){

		// Etiqueta da parada na frente no IFPE
		let etiquetaEstacao: string = '80307';
		
		// Etiqueta da linha TI TANCREDO NEVES / TI MACAXEIRA
		let etiquetaLinha: string = '060';

		this.busIntegration.getHorarioParadaLinha(etiquetaEstacao, etiquetaLinha);
	}

	getEstimacao(){

		// Etiqueta da parada na frente no IFPE
		let etiquetaEstacao: string = '80307';

		this.busIntegration.getEstimacao(etiquetaEstacao);
	}

	// Requisição está errada
	getTempoPercurso(){
		
		// Etiqueta da parada na frente no IFPE
		let etiquetaEstacao: string = '80307';

		//Erro: não utilizar esta etiqueta
		// Etiqueta da linha TI TANCREDO NEVES / TI MACAXEIRA
		let etiquetaEstacaoFim: string = '060';
		
		this.busIntegration.getTempoPercurso(etiquetaEstacao, etiquetaEstacaoFim);
	}

	// Obs.: Não retorna nada
	getMensagensParada(){
		
		// Etiqueta da parada na frente no IFPE
		let etiquetaEstacao: string = '80307';

		this.busIntegration.getMensagensParada(etiquetaEstacao);
	}

	getParadaProxima(){
		this.navCtrl.push(HorariosPage);
	}

}
