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

		return this.bluetoothSerial.subscribe('\n').subscribe();
	}

}
