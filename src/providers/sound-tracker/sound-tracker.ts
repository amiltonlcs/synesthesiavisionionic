import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the SoundTrackerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SoundTrackerProvider {

	constructor(public http: HttpClient) {
		//Carrega os audios
		this.nativeAudio.preloadSimple('right', 'assets/sound/bu_right.ogg');
		this.nativeAudio.preloadSimple('center', 'assets/sound/bu_center.ogg');
		this.nativeAudio.preloadSimple('left', 'assets/sound/bu_left.ogg');
	}

	//Sensor apenas de teste, remover.
	sensor : number[] = [150,190,190];

	//de acordo com o sensor define qual som vai tocar
	defineSound(sensor: number[]){
		
	if(this.sensor[0] < this.sensor[1] && this.sensor[0] < this.sensor[2]){
		
		this.playAudio('left', this.calcularFrequencia(this.sensor[0]));
	}else if(this.sensor[1] < this.sensor[0] && this.sensor[1] < this.sensor[2]){
		
		this.playAudio('center', this.calcularFrequencia(this.sensor[1]));
	}else if(this.sensor[2] < this.sensor[0] && this.sensor[2] < this.sensor[1]){

		this.playAudio('right', this.calcularFrequencia(this.sensor[2]));
	} 

	}
  //controla o audio que esta tocando, colocando uma frequencia entre os toques alem da duraçao do bip
  playAudio(audioName,frequencia){
	
	console.log(audioName);
	
	var ms = 700;//duraçao do bip
	
	setTimeout(() => { 
	
	}, frequencia);  

    this.nativeAudio.play(audioName);
	
	setTimeout(() => {
      this.nativeAudio.stop(audioName);
    }, ms);
   
    
  }
	//Calcula a frequencia entre os toques do bip de acordo com a distancia.
	calcularFrequencia(distancia){
		var frequencia;
		var frequencia_MIN = 600;
		var frequencia_MAX = 4000;
		var distancia_MIN = 50;

		if(distancia >= distancia_MIN){
			frequencia = distancia * 15;
		
		} else{
			frequencia = frequencia_MIN;
		}
		if(frequencia > frequencia_MAX){
			frequencia = frequencia_MAX;
		}

		console.log("frequencia atual: " + frequencia)
		
		return frequencia;
	}

}
