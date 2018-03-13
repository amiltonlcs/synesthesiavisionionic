import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

/*
  Generated class for the BluetoothProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BluetoothProvider {

	constructor(public http: HttpClient, public bluetoothSerial: BluetoothSerial) {
		console.log('Hello BluetoothProvider Provider');
	}

	getData (): any{
		this.bluetoothSerial.subscribeRawData().subscribe((success) => {

			this.bluetoothSerial.read().then(success => {
				console.log('sucesso : ' + success);
			}, err => {
				console.log('error: ' + err);
				
			})
			
			return success;
		}, (err) => {
			return err;
		});
	}

}
