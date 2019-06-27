﻿import { Component, EventEmitter, Output} from '@angular/core';

const SCALE_FACTOR = 1.2;

/*******************************************************************************
 *
 * Output Events
 * onScaleChanged()   event: scale
 * onFloorChanged()   event: 0,1,2,3,4,5
 * onModeChanged()    event: horPoints, verPoints, ladders, edges, tags
 *
 * Private Properties:
 * scale: number
 * mode
 * floorIndex
********************************************************************************/
@Component({
    selector: 'editor-dash',
    styles: [`
        #dash {
            width: 100%;
            min-width: 320px;
            text-align: center;
            vertical-align: center;
            height: 50px;
            background-color: darkorange;
            margin: 0;
        }
        #mode {
            font-size: 28px;
            margin-left: 20px;
        }
        mat-form-field {
            width: 50px;
            height: 50px;
            background-color: white;
            border: solid thin lightblue;
        }
        button {
            min-width: 50px;
            width: 50px;
            height: 50px;
            padding: 0;
            background-color: white;
        }
    `],
    template: `
        <div id="dash">
            <mat-form-field>
                <mat-select (valueChange)="floorChange($event)" [value]="floorIndex">
                    <mat-option *ngFor="let i of [1,2,3,4,5,6]" [value]="i-1">
                        {{i}}
                    </mat-option>
                </mat-select>
            </mat-form-field>

            <button mat-stroked-button (click)="scaleChange(true)">+</button>
            <button mat-stroked-button (click)="scaleChange(false)">-</button>
            <span id="mode">mode: {{mode}}</span>
        </div>`

})
export class DashComponent {

    scale = 1;
    mode = 'n';
    floorIndex = 1;

    @Output() onScaleChanged = new EventEmitter<number>();
    scaleChange(increased: boolean) {
        this.scale *= increased ? SCALE_FACTOR : 1 / SCALE_FACTOR;
        this.onScaleChanged.emit(this.scale);
    }

    @Output() onFloorIndexChanged = new EventEmitter<number>();
    floorChange(idx: number) {
        this.floorIndex = idx;
        this.onFloorIndexChanged.emit(idx);
    }

}