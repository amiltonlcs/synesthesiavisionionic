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
export class AudioProvider3 {

	private _track            : any      = null;
	private _audio            : any;
	private _source           : any;
	private _context          : any      = new (AudioContext || webkitAudioContext)();
	private _gain             : any      = null;
	
	private sensor            : number[] = [0,0,0]; // REMOVER POSTERIORMENTE OU SETAR INICIO COMO 0,0,0 PARA NAO EMITIR RUIDO NO PRIMEIRO CICLO.
	private sensibilidade     : number   = 140; //SENSIBILIDADE DO SENSOR COM RELAÇÃO AO SEU LIMITE
	private _audioTrack       : any      = 'assets/sounds/bu1seg.ogg';

	private audioSettedUp     : boolean  = false;
	private timeoutFunction   : any;

	constructor(public http: Http, public bluetoothProvider: BluetoothProvider) {
		console.log('Hello AudioProvider Provider');
		
	}

	loadSound() {

		return this.http.get(this._audioTrack, { responseType: ResponseContentType.ArrayBuffer })
			.map(res => res.arrayBuffer());
	}

	setUpAudio(bufferedContent: any) {
		
		return new Promise((resolve, reject) => {

			this._context.decodeAudioData(bufferedContent, (buffer: any) => {
				this._audio = buffer;
				this._track = this._audio;
			});

			resolve(true);
		});
	}

	stopSound() {

		if (!this._source.stop) {
			this._source.stop = this._source.noteOff;
		}

		this._source.stop(0);
	}

	playAudioTrack(track) {

		return new Promise((resolve, reject) => {
			this._gain = this._context.createStereoPanner();

			this._source = this._context.createBufferSource();
			this._source.buffer = track;
			
			this.defineSoundWebApi().then((result) => {
				let side = result;
			
				if(side !== 2 && side !== undefined){
					
					console.log(side);
					this._gain.pan.setValueAtTime(side, 0);
		

					this._source.connect(this._gain);
					this._gain.connect(this._context.destination);

					this._source.start(0, 0.1);
				} else {
					reject(false);
				}
			});
			
			resolve(true);
		});
	}


	defineSoundWebApi() {
		
		return new Promise((resolve, reject) => {

			console.log('Sensor 0 :' + this.sensor[0]);
			console.log('Sensor 1 :' + this.sensor[1]);
			console.log('Sensor 2 :' + this.sensor[2]);

			let result;
			
			if (this.sensor[0] <= this.sensibilidade ||
				this.sensor[1] <= this.sensibilidade ||
				this.sensor[2] <= this.sensibilidade) {
					
				if (this.sensor[0] < this.sensor[1] && this.sensor[0] < this.sensor[2]) {
					result = -1;
	
				} else if (this.sensor[1] < this.sensor[0] && this.sensor[1] < this.sensor[2]) {
					result = 0;
	
				} else if (this.sensor[2] < this.sensor[0] && this.sensor[2] < this.sensor[1]) {
	
					result = 1;
				}
				
			} else {
				result = 2; // retornar 2 para testar 
			}

			resolve(result);
		});
	}


	calcularFrequencia(distancia) {
		
		return new Promise((resolve, reject) => {

			let frequencia;
			let frequencia_MIN = 500;
			let frequencia_MAX = 4000;
			let distancia_MIN = 30;
		
			if (distancia >= distancia_MIN) {
				frequencia = distancia * 25;
			} else {
				frequencia = frequencia_MIN;
			}
		
			if (frequencia > frequencia_MAX) {
				frequencia = frequencia_MAX;
			}
		
			resolve(frequencia);
		});
		
	}

	/**
	 * Recebe um array com as distancias atuais do sensor, e inicia a execução do som
	 * 
	 * @param sensor 
	 */
	atualizarSensor(sensor: number[]) {
		this.sensor = sensor;
		return this.playAudioTrack(this._track);
	}
	
	loop(){
		
		// Chama a função de atualizar sensor, passando a distancia mais atual,
		return this.atualizarSensor(this.bluetoothProvider.getDistanceSensor())
			.then(() => {
				// após a execução do sensor, os valores são zerados, para evitar execução
				// de uma distância do passado 
				this.zeraDistancia()
			});
	}

	playSound(){

		//Verifica se o audio já foi configurado...
		if(!this.audioSettedUp){
			
			//Carrega o som do arquivo .ogg, como um arrayBuffer
			this.loadSound()
				.toPromise().then((arrayBufferContent) => {
					//Adiciona o conteúdo nas variáveis de audio 
					return this.setUpAudio(arrayBufferContent);
				}).then((trackResult) => {
					//Atribui true a variável, significa que o audio já foi configurado
					this.audioSettedUp = true;
				});
		}

		//Busca a distância mínima
		this.bluetoothProvider.getDistanceMin()
			.then((minDistance) => {
				//Calcula a frquência de execução do som, a partir da distância mínima
				//Obs.: O Calculo precisa ser feito antes de executar o som
				return this.calcularFrequencia(minDistance);
			}).then((freq: number) => {
				
				//Timeout para repetir a execução do som de acordo com a frequencia calculada
				this.timeoutFunction = setTimeout(() => {

					//Chama a função de execução do som, após finalizar a execução...
					this.loop().then(() => {
						//Chama a própria função para realizar o loot
						this.playSound();
					}) ;
				}, freq); 
			});
	}

	//Zera os valores presentes no sensor
	zeraDistancia(){
		this.sensor = [0,0,0];
	}

	//Para a execução do loop
	stopRunningSound(){
		clearTimeout(this.timeoutFunction);
	}
	
}
