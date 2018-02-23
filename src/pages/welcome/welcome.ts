import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//Importando as páginas para realizar a navegação
import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';
import { SynesthesiavisionPage } from '../synesthesiavision/synesthesiavision';
import { BluetoothConnectionVerifyPage } from '../bluetooth-connection-verify/bluetooth-connection-verify';


/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-welcome',
	templateUrl: 'welcome.html',
})
export class WelcomePage {

	constructor(public navCtrl: NavController, public navParams: NavParams) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad WelcomePage');
	}

  	login(){
		this.navCtrl.push(LoginPage);
  	}

  	signup(){
		this.navCtrl.push(SignupPage);
  	}

	synesthesia(){
		this.navCtrl.push(SynesthesiavisionPage);
	}

	bluetooth(){
		this.navCtrl.push(BluetoothConnectionVerifyPage);
	}
}
