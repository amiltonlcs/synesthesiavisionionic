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
declare var	webkitAudioContext: any;

@Injectable()
export class AudioProvider2 {

	private _preloader : any;
	private _track : any = null;
	private _audio : any;
	private _source : any;
	private _context : any = new (AudioContext || webkitAudioContext)();
  private _gain : any = null;
	private _variaveis: any = null;
	
	constructor(public http: Http, private _LOADER: LoadingController) {
		console.log('Hello AudioProvider Provider');
	}

	playSoundOscillator(){
		let osc = this._context.createOscillator(); // instantiate an oscillator
		osc.type = 'sine'; // this is the default - also square, sawtooth, triangle
		osc.frequency.value = 440; // Hz
		osc.connect(this._context.destination); // connect it to the destination
		osc.start(); // start the oscillator
		osc.stop(this._context.currentTime + 2); // stop 2 seconds after the current time
	}
  startSound(variaveis: any){
      this._variaveis = variaveis;
      this.loadSound();
  }
	loadSound(){

	

		this.http.get(this._variaveis.track, { responseType: ResponseContentType.ArrayBuffer })
			.map(res => res.arrayBuffer())
			.subscribe((arrayBufferContent : any) => {
				this.setUpAudio(arrayBufferContent);
			});
	}

	setUpAudio(bufferedContent: any){
		this._context.decodeAudioData(bufferedContent, (buffer: any) => {
			this._audio = buffer;
			this._track = this._audio;

			this.panner(this._track);
		});
	}


	stopSound(){
		if(!this._source.stop){
			this._source.stop = this._source.noteOff;
		}

		this._source.stop(0);
	}

	displayPreloader(message){
		this._preloader = this._LOADER.create({
			content: message
		});

		this._preloader.present();
	}

	hidePreloader(){
		this._preloader.dismiss();
	}

	changeVolume(volume){
		let percentile: number = parseInt(volume) / 100;

		// A straightforward use of the supplied value sounds awful
		// so we're using a fraction of the supplied value to
		// handle this situation
		console.log('Volume: ' + percentile);
		this._gain.gain.value = percentile * percentile;
	}

	panner(track){

		this._gain = this._context.createStereoPanner();

		this._source = this._context.createBufferSource();
		this._source.buffer = track;
    console.log(this._variaveis.side);
		this._gain.pan.setValueAtTime(this._variaveis.side,0);

		this._source.connect(this._gain);
		this._gain.connect(this._context.destination);
    this._source.start(0,0,this._variaveis.sound_duration);
	
	}

	playSound(track){
		if(!this._context.createGain){
			this._context.createGain = this._context.createGainNode;
		}

		this._gain = this._context.createGain();
		this._source = this._context.createBufferSource();
		this._source.buffer = track;
		this._source.connect(this._gain);
		this._gain.connect(this._context.destination);
    this._source.start(0);
	
	}
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
