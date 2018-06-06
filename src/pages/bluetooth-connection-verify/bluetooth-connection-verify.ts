import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { SynesthesiavisionPage } from '../synesthesiavision/synesthesiavision';
import { NativeStorage } from '@ionic-native/native-storage';
// import { PermissionProvider } from '../../providers/permission/permission';
import { AudioProvider } from '../../providers/audio/audio';
// import { SoundTrackerPage } from '../sound-tracker/sound-tracker';
import { BluetoothProvider } from '../../providers/bluetooth/bluetooth';
import { TextToSpeechProvider } from '../../providers/text-to-speech/text-to-speech';


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

    private isEnabled: boolean = false;

    //Bluetooth Variables
	private unpairedDevices  : any;
    private gettingDevices   : boolean;
    private loading          : any;

    //Sound Variables
    // public volume: any = 50;
	public isPlaying: boolean = false;

	constructor(
        private bluetoothSerial: BluetoothSerial, public navCtrl: NavController, 
        public navParams: NavParams, public alertCtrl: AlertController, 
        public loadingCtrl: LoadingController, public nativeStorage: NativeStorage,
        public audioProvider: AudioProvider, public bluetoothProvider: BluetoothProvider, 
        public ttsProvider: TextToSpeechProvider) {
        
        this.checkEnabledBluetooth();
	}

  	ionViewDidLoad() {
        this.loadSound('assets/sounds/synesthesia_sound.ogg');
  	}

	/**
     * Scans for paired and unpaired devices.
     * If an paired device has the Synesthesia name, the method looks for an address in the localStorage
     */
	startScanning() { 

        this.unpairedDevices = null;
        this.gettingDevices = true;

        //this.navCtrl.push(SynesthesiavisionPage);
        
        //Exibe o loading spinner
        this.createLoading();
        this.loading.present();

        while(!this.isEnabled){
            this.checkEnabledBluetooth();
        }

        //Verifica os dispositivos não pareados 
        this.bluetoothSerial.discoverUnpaired().then((success) => {

            //success é a lista de devivces
            this.unpairedDevices = success;
            this.gettingDevices = false;

            //Deixa de exibir o loading spinner
            this.loading.dismiss();

        }).catch((err) => {
            console.log('Deu ERRO: ' + err);

            //Deixa de exibir o loading spinner
            this.loading.dismiss();

            //Caso ocorra algum erro, exibe qual foi o erro
            this.showAlert('Erro ao conectar no Bluetooth');
        });

        //Lista os dispositivos pareados
        this.bluetoothSerial.list().then((success) => {

            // Melhorar este bloco de código
            success.forEach(element => {

                //Se já estiver pareado com o synesthesia, pega o address local e connecta automaticamente
                if((element.name).includes("Synesthesia")){
                    this.checkAddress();
                }
            });
        }).catch((err) => {
            
            console.log('Error: ' + err);
        });
    }

    success = (data) => alert(data);
    fail = (error) => alert('Erro ao conectar no Bluetooth');


    /**
     * Exibe um alerta perguntando se o usuário deseja se conectar a um endereço que 
     * foi selecionado pelo usuário.
     * 
     * Redireciona para a tela principal se o usuário desejar se conectar
     * @param address
     */
    selectDevice(device: any) {

        let alert = this.alertCtrl.create({
        title: 'Connect',
        message: 'Do you want to connect with' + device.address + '?',
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

                        if((device.name).includes('Synesthesia')){

                            this.bluetoothSerial.connect(device.address).subscribe((success)=> {
    
                                this.loadSound('assets/sounds/bluetooth_confirma.ogg');
                                this.saveAddress(device.address);
    
                                //Após conectar direcionar para a página principal do synesthesia
                                this.synesthesia();
                                
                            }, (error) => {
                                console.log(error);
                            });

                        } else{

                            this.ttsProvider.speak('Não é possível conectar, não é um dispositivo Synesthesia');
                        }

                    }
                }
            ]
        });

        alert.present();

    }

    /**
     * Disconnect the blueooth 
     */
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

    /**
     * Sends to the main page
     */
    synesthesia(){
        this.navCtrl.push(SynesthesiavisionPage);
    }

    /**
     * Creates an alert error, with the error message parameter
     * @param message 
     */
    showAlert(message: string) {
        
        let alert = this.alertCtrl.create({
            title: 'Error',
            message: message,
            buttons: ['OK']
        });

        alert.present();
    }

    /**
     * Creates the loading screen
     */
    createLoading(){
        
        let loading = this.loadingCtrl.create({
            content: 'Searching devices, please wait...',
            dismissOnPageChange: true
        });

        this.loading = loading;
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
		}, (err) => {

			console.log();
		});
    }

    /**
     * Se conecta a um endereço bluetooth já conhecido e redireciona para a página principal
     * @param address
     */
    autoConnect(address: string){
        
        this.bluetoothSerial.connect(address).subscribe((success) => {
            this.loadSound('assets/sounds/bluetooth_confirma.ogg');
            this.synesthesia();
        }, (fail) => {
            this.loadSound('assets/sounds/bluetooth_erro.ogg');
        });
    }

    /** 
     * Verify if the bluetooth is enable, if not, enable it
     */
    checkEnabledBluetooth(){
        this.isEnabled = this.bluetoothProvider.checkEnabledBluetooth();
    }

    /* Audio Methods
       .
       .
       .
    */ 
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
