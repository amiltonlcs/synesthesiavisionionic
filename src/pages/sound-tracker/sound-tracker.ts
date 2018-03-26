import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AudioProvider2 } from './audio';

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

  sensor : number[] = [130,90,190];
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public audio: AudioProvider2) {

    // this.nativeAudio.preloadSimple('right', 'assets/sound/bu_right.ogg');
    // this.nativeAudio.preloadSimple('right_center', 'assets/sound/bu_right_center.ogg');
    // this.nativeAudio.preloadSimple('center', 'assets/sound/bu_center.ogg');
    // this.nativeAudio.preloadSimple('left_center', 'assets/sound/bu_left_center.ogg');
    // this.nativeAudio.preloadSimple('left', 'assets/sound/bu_left.ogg');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SoundTrackerPage');
  }

  defineSoundWebApi(){
    this.audio.defineSoundWebApi();
  }
  
}
