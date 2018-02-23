import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BluetoothConnectionVerifyPage } from './bluetooth-connection-verify';

@NgModule({
  declarations: [
    BluetoothConnectionVerifyPage,
  ],
  imports: [
    IonicPageModule.forChild(BluetoothConnectionVerifyPage),
  ],
})
export class BluetoothConnectionVerifyPageModule {}
