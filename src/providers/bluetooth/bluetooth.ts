import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { NativeStorage } from '@ionic-native/native-storage';
import { AudioProvider } from '../audio/audio';
import { NavController } from 'ionic-angular';
import { SynesthesiavisionPage } from '../../pages/synesthesiavision/synesthesiavision';

/*
  Generated class for the BluetoothProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BluetoothProvider {

	private isEnabled: boolean = false;
	
	//Sound Variables
    public volume: any = 50;
	public isPlaying: boolean = false;
    public tracks: any = [
		{
		   	artist  : 'Time Synesthesia',
			name    : 'Confirmar bluetooth',
		   	track   : 'assets/sounds/bluetooth_confirma.ogg'
		},
		{
			artist  : 'Time Synesthesia',
		   	name    : 'Erro bluetooth',
		   	track   : 'assets/sounds/bluetooth_erro.ogg'
		},
		{
			artist  : 'Time Synesthesia',
		   	name    : 'Som synesthesia',
		   	track   : 'assets/sounds/synesthesia_sound.ogg'
		},
		{
			artist  : 'Time Synesthesia',
		   	name    : 'Finalizar aplicativo',
		   	track   : 'assets/sounds/finalizar.ogg'
		}
	];

	constructor(public http: HttpClient, public bluetoothSerial: BluetoothSerial,
				public nativeStorage: NativeStorage, public audioProvider: AudioProvider) {
		console.log('Hello BluetoothProvider Provider');
	}

	getData (): any{

		return this.bluetoothSerial.subscribe('\n').subscribe();
	}

	connectToDevice(address: string){
		return this.bluetoothSerial.connect(address);
	}

	    /**
     * Salva o endereço do dispositivo pressionado caso haja uma conexão bem sucedida
     * @param address
     */
    saveAddress(address: string){
        this.nativeStorage.setItem('bt_address', address).then(() => { 
            console.log('Stored item!')
        }, error => {
            console.error('Error storing item', error)
        });
    }

    /**
     * Verify if the local storage has the address of a synesthesia device
     */
    checkAddress(){
		
        this.nativeStorage.getItem('bt_address').then((success) => {
			this.autoConnect(success);
		}).catch((err) => {
			console.log(err);
		});
    }

    /**
     * Se conecta a um endereço bluetooth já conhecido e redireciona para a página principal
     * @param address
     */
    autoConnect(address: string){
        
       	return this.bluetoothSerial.connect(address).subscribe((success) => {
			this.loadSound('assets/sounds/bluetooth_confirma.ogg');
			this.synesthesia();
		}, (fail) => {
			this.loadSound('assets/sounds/bluetooth_erro.ogg');
		});
	}

	synesthesia(){
        // this.navCtrl.push(SynesthesiavisionPage);
    }

    /** 
     * Verify if the bluetooth is enable, if not, enable it
     */
    checkEnabledBluetooth(): boolean{

        this.bluetoothSerial.isEnabled().then((ativado) => {
            this.isEnabled = true;
        }, (naoAtivado) => {
            
            //Pede ao usuário para habilitar o bluetooth
            this.bluetoothSerial.enable().then((success) => {
                this.isEnabled = true;
            }, (err) => {
                this.isEnabled = false;
            });
		});
		
		return this.isEnabled;
	}
	
	loadSound(track : string){
		if(!this.isPlaying){
			this.triggerPlayback(track);
		}
		else{
			this.isPlaying  = false;
			this.stopPlayback();
			this.triggerPlayback(track);
		}
	}

	triggerPlayback(track : string){
		this.audioProvider.loadSound(track);
		this.isPlaying  = true;
	}

	stopPlayback(){
		this.isPlaying  = false;
		this.audioProvider.stopSound();
	}
}
