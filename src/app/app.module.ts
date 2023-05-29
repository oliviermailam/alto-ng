import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AltoApiService } from './shared/providers/alto-api.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { ExpensePopupComponent } from './shared/components/expense-popup';

@NgModule({
  declarations: [
    AppComponent,
    ExpensePopupComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule
  ],
  providers: [AltoApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
