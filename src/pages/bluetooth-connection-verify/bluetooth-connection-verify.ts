import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { WelcomePage } from '../welcome/welcome';
import { SynesthesiavisionPage } from '../synesthesiavision/synesthesiavision';

/**
 * Generated class for the BluetoothConnectionVerifyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  	selector: 'page-bluetooth-connection-verify',
  	templateUrl: 'bluetooth-connection-verify.html',
})

export class BluetoothConnectionVerifyPage {

	unpairedDevices: any;
    pairedDevices: any;
    gettingDevices: Boolean;

	  constructor(private bluetoothSerial: BluetoothSerial, public navCtrl: NavController, 
		public navParams: NavParams, public alertCtrl: AlertController) {
		
		bluetoothSerial.enable();
	}

  	ionViewDidLoad() {
    	console.log('ionViewDidLoad BluetoothConnectionVerifyPage');
  	}

	
	startScanning() {

        this.pairedDevices = null;
        this.unpairedDevices = null;
        this.gettingDevices = true;

        this.navCtrl.push(SynesthesiavisionPage);

        this.bluetoothSerial.discoverUnpaired().then((success) => {
            this.unpairedDevices = success;
            this.gettingDevices = false;
            
            success.forEach(element => {
                // alert(element.name);
            });
        },
        (err) => {
            console.log(err);
        })

        this.bluetoothSerial.list().then((success) => {
            this.pairedDevices = success;
        },
        (err) => {

        })
    }

    success = (data) => alert(data);
    fail = (error) => alert(error);

    selectDevice(address: any) {

        let alert = this.alertCtrl.create({
        title: 'Connect',
        message: 'Do you want to connect with?',
        buttons: 
            [
                {
                    text: 'Cancel',
                    role: 'cancel',

                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Connect',

                    handler: () => {
                        this.bluetoothSerial.connect(address).subscribe(this.success, this.fail);

                        //Após conectar direcionar para a página principal do synesthesia
                        this.navCtrl.push(SynesthesiavisionPage);
                    }
                }
            ]
        });

        alert.present();

    }

    disconnect() {

        let alert = this.alertCtrl.create({
        title: 'Disconnect?',
        message: 'Do you want to Disconnect?',
        buttons: 
            [
                {
                    text: 'Cancel',
                    role: 'cancel',

                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Disconnect',

                    handler: () => {
                        this.bluetoothSerial.disconnect();
                    }
                }
            ]
        });

        alert.present();
	}
	
	welcome(){
		this.navCtrl.push(WelcomePage);
	}
}
