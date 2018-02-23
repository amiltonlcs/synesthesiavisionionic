import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';
//import { WelcomePage } from '../welcome/welcome';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {

	constructor(public navCtrl: NavController, public app: App) {

	}

	// Poderia utilizar this.navCtrl.push(WelcomePage), porém
	// Ele está redirecionando para a página root que já está definida em app.component.ts, então
	// pegamos uma referência ao root e redirecionamos para ele.
	logout(){
		//Api Token para realizar o logoff
		const root = this.app.getRootNav();
		root.popToRoot();
	}

}
