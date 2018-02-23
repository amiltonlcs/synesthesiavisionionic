import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public mobileAccessibility: MobileAccessibility) {

    //  Modificar futuramente para permitir a acessibilidade do usuário
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

}
