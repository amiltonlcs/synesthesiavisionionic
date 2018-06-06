import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { TextToSpeechProvider } from '../../providers/text-to-speech/text-to-speech';
import { BusIntegrationProvider } from '../../providers/bus-integration/bus-integration';
import { NativeStorage } from '@ionic-native/native-storage';

/**
 * Generated class for the HorariosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-horarios',
	templateUrl: 'horarios.html',
})
export class HorariosPage {

	private savedLines            : boolean = false;
	private gettingBusSchedule    : boolean = false;
	private gettingBusLines       : boolean = false;
	private gettingCloserStops    : boolean = false
	private loading               : any;

	private listaParadas          : any;
	private listaHorariosDaParada : any;

	constructor(public navCtrl: NavController, public navParams: NavParams,
				public ttsProvider: TextToSpeechProvider, public busIntegration: BusIntegrationProvider,
				public nativeStorage: NativeStorage, public loadingCtrl: LoadingController) {
    }

    ionViewDidLoad() {
		console.log('ionViewDidLoad HorariosPage');
		
		this.checkLineNameByLabel('56').then((result) => {
		}).catch((err) => {
			this.getLinhas();
		});

		this.getParadas();
	}

	//Fala os dados passados passados por atributo
	speakData(busLine: string, arrivalTime: string){
		let arrival = this.transformTime(arrivalTime);
		let frase = 'Ônibus linha' + busLine + ', chegando em ' + arrival + '.'
		
		this.ttsProvider.speak(frase);
	}

	getLinhas(){
		
		if(!this.gettingBusLines){
			
			//Boolean para verifica se o usuiário
			this.gettingBusLines = true;
	
			//Exibe o loading spinner
			this.createLoading();
			this.loading.present();
	
			return new Promise((resolve, reject) => {
	
				this.busIntegration.getLinhas().then((linhasEncontradas) => {
					
					linhasEncontradas.forEach(linha => {
						if (linha.id == 346) {
							return; // por conta da linha 914 que esta duplicada ****
						}
						if ( linha.nombre.indexOf('EXTINTA') === -1){
							this.saveLines(linha.id, linha.nombre);
						}
					});
	
					this.gettingBusLines = false;
					this.loading.dismiss();
					resolve(true);
				}).catch((err) => {
					this.gettingBusLines = false;
					this.loading.dismiss();
					reject(false);
				});
			});
		}else {
			this.ttsProvider.speak('Verificação de paradas próximas em andamento.');
		}

	}
	
	getParadas(){

		//Verifica se já existe uma requisição pelas paradas
		if(!this.gettingCloserStops){
			
			//Inicializou a busca pelas paradas
			this.gettingCloserStops = true;

			//Avisa que a realização está em andamento
			this.ttsProvider.speak('Verificando paradas próximas.');

			//Exibe o loading spinner
			this.createLoading();
			this.loading.present();
			
			this.busIntegration.startChecking().then((etiquetasParadas) => {
				
				//Criado um objeto que recebe um nome e é associado ao tipo ParadasRequest (Array de String)
				let etiquetasParadasArray: { [params: string]: string[]; } = {};
				etiquetasParadasArray['params'] = etiquetasParadas; // Adiciona os dados necessários
	
				return this.busIntegration.getParadasPorLabel(etiquetasParadasArray);
			}).then((paradasEncontradas) => {
				this.listaParadas = paradasEncontradas;

				//Terminou de realizar a busca pelas paradas
				this.gettingCloserStops = false;
				this.loading.dismiss();
			}).catch((err) => {
				this.ttsProvider.speak('Ocorreu algum erro ao verificar as paradas.');

				//Terminou de realizar a busca pelas paradas
				this.gettingCloserStops = false;
				this.loading.dismiss();
			});
		} else {
			this.ttsProvider.speak('Verificação de paradas próximas em andamento.');
		}

	}

	getHorarios(labelParada){

		if(!this.gettingBusSchedule){

			//Inicializou a busca pelos horarios
			this.gettingBusSchedule = true;

			this.ttsProvider.speak('Verificando horaários da parada.');

			//Exibe o loading spinner
			this.createLoading();
			this.loading.present();
	
			this.busIntegration.getEstimacao(labelParada).then((estimacoes) => {
	
				estimacoes.forEach(estimacao => {
					this.checkLineNameByLabel((estimacao.line).toString()).then((nombre) => {
						if(nombre !== undefined){
							estimacao.line = nombre;
						}
					});
				});
	
				this.setEstimacoes(estimacoes).then((estimacoesOrdenadas) => {
					this.listaHorariosDaParada = estimacoes;

					//Terminou de realizar a busca pelos horarios
					this.gettingBusSchedule = false;
					this.loading.dismiss();
				}) ;
	
			}).catch((err) => {
				this.ttsProvider.speak('Ocorreu algum erro ao verificar os horarios das linhas.');

				//Terminou de realizar a busca pelos horarios
				this.gettingBusSchedule = false;
				this.loading.dismiss();
			});
		}else {
			this.ttsProvider.speak('Verificação de horários em andamento.');
		}


	}

	//Ordena e atribui as estimaçoes a variavel global contendo a lista de estimaçoes
	setEstimacoes(estimacoes){
		
		return new Promise((resolve, reject) => {

			estimacoes.sort((tempoA,tempoB):Number => {
				
				if(tempoA.exitTime < tempoB.exitTime) {
					return -1;
				} else if(tempoA.exitTime > tempoB.exitTime){
					return 1;
				} 
					
				return 0;
			});

			resolve(estimacoes);
		});
	}

	transformTime(value: string) {

		let dataFiltrada = '';

		let actualDate = new Date();
		let miliseconds = value.slice(6, 19);

		let result = Number(miliseconds) - actualDate.getTime();
		let resultDate = new Date(result);

		var h = resultDate.getUTCHours();
		var m = resultDate.getUTCMinutes();

		if(h !== 0){

			if(h > 1){
				dataFiltrada = h + ' horas ';
			} else{
				dataFiltrada = h + ' hora ';
			}
		}

		if(m !== 0){

			if(m > 1){

				dataFiltrada = dataFiltrada + m + ' minutos ';
			} else{
				dataFiltrada = dataFiltrada+ m + ' minuto ';
			}
		}

		return dataFiltrada;
	}

	/**
     * Creates the loading screen
     */
    createLoading(){
        
        let loading = this.loadingCtrl.create({
            content: 'Procurando horários, espere...',
            dismissOnPageChange: true
        });

        this.loading = loading;
    }

	/**
     * Salva o endereço do dispositivo pressionado caso haja uma conexão bem sucedida
     * @param linhas
     */
    saveLines(lineLabel: string, linhas: string){
        this.nativeStorage.setItem(lineLabel, linhas).then(() => { 
            console.log('Stored item! Nome: + ' + lineLabel);
        }, error => {
            console.error('Error storing item', error)
        });
    }

    /**
     * Verify if the local storage has the Lines of a synesthesia device
     */
    checkLineNameByLabel(lineLabel: string){
        return this.nativeStorage.getItem(lineLabel);
	}

	listarHorarios(){
		this.listaHorariosDaParada.forEach(horario => {
			this.speakData(horario.line , this.transformTime(horario.exitTime));
		});
	}

	voltar(){
		this.listaHorariosDaParada = undefined;
	}

}
