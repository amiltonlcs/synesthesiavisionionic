import { Http, ResponseContentType } from '@angular/http';
import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import 'rxjs/add/operator/map';

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
	private sensor: number[] = [130, 90, 190];// REMOVER POSTERIORMENTE OU SETAR INICIO COMO 0,0,0 PARA NAO EMITIR RUIDO NO PRIMEIRO CICLO.
	private sensibilidade: number = 140;//sENSIBILIDADE DO SENSOR COM RELAÇÃO AO SEU LIMITE

	constructor(public http: Http, private _LOADER: LoadingController) {
		console.log('Hello AudioProvider Provider');
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

			this.panner(this._track);
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
		this._gain.gain.value = percentile * percentile;
	}

	panner(track) {

		this._gain = this._context.createStereoPanner();

		this._source = this._context.createBufferSource();
		this._source.buffer = track;
		console.log(this._variaveis.side);

		let side = this.defineSoundWebApi();



		this._gain.pan.setValueAtTime(side, 0);

		this._source.connect(this._gain);
		this._gain.connect(this._context.destination);
		this._source.start(0, 0,0.8);
	}

	defineSoundWebApi() {
		if (this.sensor[0] <= this.sensibilidade ||
			this.sensor[1] <= this.sensibilidade ||
			this.sensor[2] <= this.sensibilidade) {

			if (this.sensor[0] < this.sensor[1] && this.sensor[0] < this.sensor[2]) {

				return -1

			} else if (this.sensor[1] < this.sensor[0] && this.sensor[1] < this.sensor[2]) {

				return 0;

			} else if (this.sensor[2] < this.sensor[0] && this.sensor[2] < this.sensor[1]) {

				return 1;
			}
		}
	}

	// playAudio(audioNumber?, frequencia?) {
	// 	console.log(audioNumber);
	// 	//SIDE: direçao que o som vai tocar. -1 ( esquerda ), 0 ( centro ), 1 (direita)
	// 	//SOUND_DURATION: duração do som em segundos
	// 	//TRACK: caminho para o arquivo de som
	// 	//FREQUENCIA: frequencia entre os sons ( ainda nao implementado pois nao existe um loop ainda).
	// 	//this.frequencyModule(this._track);
	// 	let variaveis: any = { side: Number, sound_duration: Number, track: String, frequencia: Number };

	// 	variaveis.side = 1;
	// 	variaveis.sound_duration = 0.8;
	// 	variaveis.track = 'assets/sounds/bu.ogg';
	// 	variaveis.frequencia = 1;

		
	// 	setTimeout(() => {
	// 		//CRIA A FREQUENCIA QUE ATUALMENTE É USADA EM TESTES
	// 		this.startSound(variaveis);
	// 		// this.defineSoundWebApi();
			
	// 	}, 1200);

	// 	return null;
	// }

	calcularFrequencia(distancia) {
		var frequencia;
		var frequencia_MIN = 600;
		var frequencia_MAX = 4000;
		var distancia_MIN = 50;

		if (distancia >= distancia_MIN) {
			frequencia = distancia * 20;
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
		this.loadSound();
	}
}
