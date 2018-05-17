import { NgModule } from '@angular/core';
import { DatePipe } from './date/date';
import { SortPipe } from './sort/sort';
@NgModule({
	declarations: [DatePipe,
    SortPipe],
	imports: [],
	exports: [DatePipe,
    SortPipe]
})
export class PipesModule {}
