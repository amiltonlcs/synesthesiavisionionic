import { AudioProvider } from './audio';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeAudio } from '@ionic-native/native-audio'

 /**
 * Generated class for the SoundTrackerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sound-tracker',
  templateUrl: 'sound-tracker.html',
})
export class SoundTrackerPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public nativeAudio: NativeAudio, public audio: AudioProvider) {

    this.nativeAudio.preloadSimple('right', 'assets/sound/bu_right.ogg');
    this.nativeAudio.preloadSimple('right_center', 'assets/sound/bu_right_center.ogg');
    this.nativeAudio.preloadSimple('center', 'assets/sound/bu_center.ogg');
    this.nativeAudio.preloadSimple('left_center', 'assets/sound/bu_left_center.ogg');
    this.nativeAudio.preloadSimple('left', 'assets/sound/bu_left.ogg');


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SoundTrackerPage');
  }

  sensor : number[] = [150,190,190];

  defineSound(sensor: number[]){

   if(this.sensor[0] < this.sensor[1] && this.sensor[0] < this.sensor[2]){

      this.playAudio(-1, this.calcularFrequencia(this.sensor[0]));

   }else if(this.sensor[1] < this.sensor[0] && this.sensor[1] < this.sensor[2]){

      this.playAudio(0, this.calcularFrequencia(this.sensor[1]));

   }else if(this.sensor[2] < this.sensor[0] && this.sensor[2] < this.sensor[1]){

      this.playAudio(1, this.calcularFrequencia(this.sensor[2]));

   }

  }
  playAudio(audioNumber,frequencia){
    console.log(audioNumber);
    //SIDE: direçao que o som vai tocar. -1 ( esquerda ), 0 ( centro ), 1 (direita)
    //SOUND_DURATION: duração do som em segundos
    //TRACK: caminho para o arquivo de som
    //FREQUENCIA: frequencia entre os sons ( ainda nao implementado pois nao existe um loop ainda).

    let variaveis: any = { side: Number, sound_duration: Number, track: String, frequencia: Number};

    variaveis.side = audioNumber;
    variaveis.sound_duration = 1;
    variaveis.track = 'assets/sound/bu.ogg';
    variaveis.frequencia = frequencia;

    this.audio.startSound(variaveis);

    setTimeout(() =>
    {
      //CRIA A FREQUENCIA QUE ATUALMENTE É USADA EM TESTES
      this.defineSoundWebApi(this.sensor);

    },
    frequencia);


  }

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

  defineSoundWebApi(sensor: number[]){
    if(this.sensor[0] < this.sensor[1] && this.sensor[0] < this.sensor[2]){

        this.playAudio(-1, this.calcularFrequencia(this.sensor[0]));

    }else if(this.sensor[1] < this.sensor[0] && this.sensor[1] < this.sensor[2]){

        this.playAudio(0, this.calcularFrequencia(this.sensor[1]));

    }else if(this.sensor[2] < this.sensor[0] && this.sensor[2] < this.sensor[1]){

        this.playAudio(1, this.calcularFrequencia(this.sensor[2]));

    }
  }
}
