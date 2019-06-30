import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatSelectModule} from '@angular/material';
 
import {AppComponent}   from './app.component';
import {MainComponent} from "./main.component";
import {DashComponent} from "./dash.component";

import {DataService} from './data/dataService';
import {FormsModule} from "@angular/forms";


@NgModule({
    imports: [BrowserModule, BrowserAnimationsModule, MatButtonModule, MatSelectModule, FormsModule],
    declarations: [AppComponent, MainComponent, DashComponent],
    providers: [DataService],
    bootstrap: [AppComponent]
})
export class AppModule { }