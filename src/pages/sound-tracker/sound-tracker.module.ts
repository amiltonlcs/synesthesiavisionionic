import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SoundTrackerPage } from './sound-tracker';

@NgModule({
  declarations: [
    SoundTrackerPage,
  ],
  imports: [
    IonicPageModule.forChild(SoundTrackerPage),
  ],
})
export class SoundTrackerPageModule {}
