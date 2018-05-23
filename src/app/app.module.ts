import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
//import { SuperTableModule } from 'ngx-super-table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    //SuperTableModule,
    NgxDatatableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
