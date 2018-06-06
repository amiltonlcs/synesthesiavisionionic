import { Http, ResponseContentType } from '@angular/http';
import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { BluetoothProvider } from '../../providers/bluetooth/bluetooth';

/*
  Generated class for the AudioProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

declare var AudioContext: any;
declare var webkitAudioContext: any;

@Injectable()
export class AudioProvider2 {

	private _preloader: any;
	private _track: any = null;
	private _audio: any;
	private _source: any;
	private _context: any = new (AudioContext || webkitAudioContext)();
	private _gain: any = null;
	private _variaveis: any = null;
	private sensor: number[] = [0,0,0]; // REMOVER POSTERIORMENTE OU SETAR INICIO COMO 0,0,0 PARA NAO EMITIR RUIDO NO PRIMEIRO CICLO.
	private sensibilidade: number = 140; //SENSIBILIDADE DO SENSOR COM RELAÇÃO AO SEU LIMITE

	//
	private numberSensor      : number   = 3;
	private distanceSensor    : number[] = [this.numberSensor];
	private intervalo         : any; // To execute the sound in loop//Modificar
	
	private variaveis: any = { side: Number, sound_duration: Number, track: String, frequencia: Number };

	constructor(public http: Http, private _LOADER: LoadingController, public bluetoothProvider: BluetoothProvider) {
		console.log('Hello AudioProvider Provider');

		this.variaveis.side = 1;
		this.variaveis.sound_duration = 0.8;
		this.variaveis.track = 'assets/sounds/bu.ogg';
		this.variaveis.frequencia = 1;
	}

	playSoundOscillator() {
		let osc = this._context.createOscillator(); // instantiate an oscillator
		osc.type = 'sine'; // this is the default - also square, sawtooth, triangle
		osc.frequency.value = 440; // Hz
		osc.connect(this._context.destination); // connect it to the destination
		osc.start(); // start the oscillator
		osc.stop(this._context.currentTime + 2); // stop 2 seconds after the current time
	}

	startSound(variaveis: any) {
		this._variaveis = variaveis;
		this.loadSound();
	}

	loadSound() {
		// let side = this.defineSoundWebApi();
		// if(side == 1){
		// 	this._variaveis.track = "caminhoSom";
		// }else if(side == -1){
		// 	this._variaveis.track = "caminhoSom";
		// }
		this.http.get(this._variaveis.track, { responseType: ResponseContentType.ArrayBuffer })
			.map(res => res.arrayBuffer())
			.subscribe((arrayBufferContent: any) => {
				this.setUpAudio(arrayBufferContent);
			});
	}

	setUpAudio(bufferedContent: any) {
		this._context.decodeAudioData(bufferedContent, (buffer: any) => {
			this._audio = buffer;
			this._track = this._audio;

			this.playAudioTrack(this._track);
		});
	}


	stopSound() {
		if (!this._source.stop) {
			this._source.stop = this._source.noteOff;
		}

		this._source.stop(0);
	}

	displayPreloader(message) {
		this._preloader = this._LOADER.create({
			content: message
		});

		this._preloader.present();
	}

	hidePreloader() {
		this._preloader.dismiss();
	}

	changeVolume(volume) {
		let percentile: number = parseInt(volume) / 100;

		// A straightforward use of the supplied value sounds awful
		// so we're using a fraction of the supplied value to
		// handle this situation
		console.log('Volume: ' + percentile);
		this._gain.value = percentile;
	}

	playAudioTrack(track) {

		this._gain = this._context.createStereoPanner();

		this._source = this._context.createBufferSource();
		this._source.buffer = track;
		let side = this.defineSoundWebApi();
		console.log(side)
			
		
			//TESTAR AINDA
			// if(side = 2){
			// 	this._gain.pan.setValueAtTime(side, 0);
			// 	this._source.connect(this._gain);
			// 	this._gain.connect(this._context.destination);
			// 	this._source.start(0, 0, 0);
			// 	side = 0;
			// } else{
			// 	this._gain.pan.setValueAtTime(side, 0);

			// 	this._source.connect(this._gain);
			// 	this._gain.connect(this._context.destination);
			// 	this._source.start(0, 0,0.9);
			// }
		
		this._gain.pan.setValueAtTime(side, 0);

		this._source.connect(this._gain);
		this._gain.connect(this._context.destination);
		this._source.start(0, 0,0.9);
	}


	defineSoundWebApi() {
		
		if (this.sensor[0] <= this.sensibilidade ||
			this.sensor[1] <= this.sensibilidade ||
			this.sensor[2] <= this.sensibilidade) {
			
			if (this.sensor[0] < this.sensor[1] && this.sensor[0] < this.sensor[2]) {
				//this._variaveis.track = "x";
				return -1;

			} else if (this.sensor[1] < this.sensor[0] && this.sensor[1] < this.sensor[2]) {

				return 0;

			} else if (this.sensor[2] < this.sensor[0] && this.sensor[2] < this.sensor[1]) {
				//this._variaveis.track = "y";
				return 1;
			}
		}
		else{
			return 0; // retornar 2 para testar 
		}
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


	frequencyModule(track) {
		this._gain = this._context.createStereoPanner();
		let biquadFilter = this._context.createBiquadFilter();
		this._source = this._context.createBufferSource();

		//Create the source
		this._source.buffer = track;
		this._gain.pan.value = 0;

		// Descobrir como funciona o filtro
		biquadFilter.type = "lowshelf";
		biquadFilter.frequency.setValueAtTime(350, 0);
		biquadFilter.gain.setValueAtTime(5, 0); // Volume do gain
		biquadFilter.detune.setValueAtTime(440, 0);

		this._source.connect(this._gain);
		this._gain.connect(biquadFilter);
		biquadFilter.connect(this._context.destination);

		this._source.loop = false; // Som em loop?
		this._source.playbackRate.value = 1.0; // Velocidade de reprodução do som
		this._source.start(0);
	}

	atualizarSensor(sensor: number[], variaveis) {
		this.sensor = sensor;
		this._variaveis = variaveis;

		console.log('lado: ' + variaveis.side + 
			'duracao: ' + variaveis.sound_duration +
			'som: ' + variaveis.track +
			'frequencia: ' + variaveis.frequencia);
		
		this.loadSound();
	}

	playSound(){

		this.intervalo = setInterval(() => {

			// Como o método de salvar a distancia do sensor saiu da classe do synesthesiavision
			// É necessário atualizar o distanceSensor antes de executar o som.
			this.distanceSensor = this.bluetoothProvider.getDistanceSensor();

			this.atualizarSensor(this.distanceSensor, this.variaveis);
		}, this.calcularFrequencia(this.bluetoothProvider.getDistanceMin()));
	}

	stopRunningSound(){
		clearInterval(this.intervalo);
	}
	
}
