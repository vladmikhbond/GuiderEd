import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatSelectModule} from '@angular/material';
 
import {AppComponent}   from './app.component';
import {EditorComponent} from "./editor.component";
import {EditorDashComponent} from "./editorDash.component";

import {EditorService} from './data/editor.service';


@NgModule({
    imports: [BrowserModule, BrowserAnimationsModule, MatButtonModule, MatSelectModule],
    declarations: [AppComponent, EditorComponent, EditorDashComponent],
    providers: [EditorService],
    bootstrap: [AppComponent]
})
export class AppModule { }