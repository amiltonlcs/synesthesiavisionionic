import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { SynesthesiavisionPage } from '../synesthesiavision/synesthesiavision';
import { NativeStorage } from '@ionic-native/native-storage';
import { AndroidPermissions } from '@ionic-native/android-permissions';


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
    loading: any;

    private permissionsNeeded: any =  [
		this.permissions.PERMISSION.ACCESS_FINE_LOCATION,
		this.permissions.PERMISSION.ACCESS_COARSE_LOCATION,
		this.permissions.PERMISSION.INTERNET
	];

	constructor(
        private bluetoothSerial: BluetoothSerial, public navCtrl: NavController, 
        public navParams: NavParams, public alertCtrl: AlertController, 
        public loadingCtrl: LoadingController, public nativeStorage: NativeStorage,
        public permissions: AndroidPermissions) {
        
        this.checkEnabledBluetooth();
        this.getPermissions();
	}

  	ionViewDidLoad() {
    	console.log('ionViewDidLoad BluetoothConnectionVerifyPage');
  	}

	/**
     * Scans for paired and unpaired devices.
     * If an paired device has the Synesthesia name, the method looks for an address in the localStorage
     */
	startScanning() { 

        this.pairedDevices = null;
        this.unpairedDevices = null;
        this.gettingDevices = true;

        //this.navCtrl.push(SynesthesiavisionPage);
        
        //Exibe o loading spinner
        this.createLoading();
        this.loading.present();

        while(!this.bluetoothSerial.isEnabled()){
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
        })

        //Lista os dispositivos pareados
        this.bluetoothSerial.list().then((success) => {

            //Lista dos devices pareados
            this.pairedDevices = success;

            // Melhorar este bloco de código
            this.pairedDevices.forEach(element => {

                //Se já estiver pareado com o synesthesia, pega o address local e connecta automaticamente
                if(element.name === "Synesthesia"){
                    this.checkAddress();
                }
            });
        },
        (err) => {

        })
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

                                this.saveAddress(device.address);
    
                                //Após conectar direcionar para a página principal do synesthesia
                                this.synesthesia();
                            }
                            
                            console.log(success);
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
        this.bluetoothSerial.connect(address).subscribe(this.success, this.fail);

        this.synesthesia();
    }

    /** 
     * Verify if the bluetooth is enable, if not, enable it
     * 
     * Melhorar este bloco de código
     */
    checkEnabledBluetooth(){
        if(this.bluetoothSerial.isEnabled()){
            this.bluetoothSerial.enable();
        }
    }

    getPermissions(){

        this.permissionsNeeded.forEach(element => {

            this.permissions.checkPermission(element).then((result) => {

                console.log(result + ' has permission? ' + result.hasPermission);

                if(!result.hasPermission){
                    console.log('Entrou no request Permission');
                    this.permissions.requestPermission(result).then((success) => {
                        console.log('requested :' + success);
                    }, (err) => {
                        console.log('Requested Error: ' + err);
                        
                    });
                }
    
                console.log(result + ' has permission? ' + result.hasPermission);
            }, (err) => {
    
                console.log('Error occuried: ' + err);
            }).catch((err) => {
               
                console.log('Could not handle checkPermission Promise. ' + err);
            });
            
        });
	}
}
