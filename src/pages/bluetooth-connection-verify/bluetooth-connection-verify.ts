import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { SynesthesiavisionPage } from '../synesthesiavision/synesthesiavision';
import { NativeStorage } from '@ionic-native/native-storage';
import { PermissionProvider } from '../../providers/permission/permission';
import { AudioProvider } from '../../providers/audio/audio';
import { SoundTrackerPage } from '../sound-tracker/sound-tracker';


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
	unpairedDevices  : any;
    gettingDevices   : boolean;
    loading          : any;

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

	constructor(
        private bluetoothSerial: BluetoothSerial, public navCtrl: NavController, 
        public navParams: NavParams, public alertCtrl: AlertController, 
        public loadingCtrl: LoadingController, public nativeStorage: NativeStorage,
        public permissionsProvider: PermissionProvider, public audioProvider: AudioProvider) {
        
        this.checkEnabledBluetooth();
        this.permissionsProvider.getPermissions();
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

            //this.synesthesia();
        },
        (err) => {
            console.log('Deu ERRO: ' + err);

            //Deixa de exibir o loading spinner
            this.loading.dismiss();

            //Caso ocorra algum erro, exibe qual foi o erro
            this.showAlert(err);
        });

        //Lista os dispositivos pareados
        this.bluetoothSerial.list().then((success) => {

            // Melhorar este bloco de código
            success.forEach(element => {

                //Se já estiver pareado com o synesthesia, pega o address local e connecta automaticamente
                if(element.name === "Synesthesia"){
                    this.checkAddress();
                }
            });
        }, (err) => {
            console.log('Error: ' + err);
            
        });
    }

    success = (data) => alert(data);
    fail = (error) => alert(error);


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
                        this.bluetoothSerial.connect(device.address).subscribe((success)=> {

                            if(device.name === 'Synesthesia'){

                                this.loadSound('assets/sounds/bluetooth_confirma.ogg');
                                this.saveAddress(device.address);
    
                                //Após conectar direcionar para a página principal do synesthesia
                                this.synesthesia();
                            }
                            
                        }, (error) => {
                            console.log(error);
                        });
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
     * 
     * Melhorar este bloco de código
     * 
     * Ver como realizar chain of Promises
     */
    checkEnabledBluetooth(){

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

	changeVolume(volume : any){
		console.log(volume.value);
		this.audioProvider.changeVolume(volume.value);
	}

	stopPlayback(){
		this.isPlaying  = false;
		this.audioProvider.stopSound();
	}
    
    panner(track){
        this.audioProvider.panner(track);
    }

    soundTracker(){
        this.navCtrl.push(SoundTrackerPage);
    }
}
