import { Component, EventEmitter, Output} from '@angular/core';
import {DataService} from "./data/dataService";

const SCALE_FACTOR = 1.2;

/*******************************************************************************
 * Properties:
 *     scale: number
 *     mode: horPoints, verPoints, ladders, edges, tags
 *     floorIndex: 0,1,2,3,4,5
 *
 * Output Events
 *     onScaleChanged()   event: scaleFactor | 1/scaleFactor
 *     onChanged()
 ********************************************************************************/
@Component({
    selector: 'dash',
    styles: [`
        #dash {
            width: 100%;
            min-width: 320px;
            padding-left: 20px;
            height: 50px;
            background-color: darkorange;
            font-size: 16px;
        }
        #mode {
            font-size:40px;
            margin: 0 10px 0 10px;
            text-align: center;
            vertical-align: top;
        }
        mat-form-field, button, textarea {
            width: 50px;
            height: 50px;
            background-color: white;
            border: solid thin lightblue;
            vertical-align: top;
            margin-left: 2px;
            padding: 2px;
        }

        mat-form-field {
            font-size: 14px;
            font-weight: bold;
        }
        
        textarea {
             width: 100px;
        }

        #tags, #coords {
            width: 120px;
            height: 25px;
        }
        .large-letter {
            font-size: 24px;
            font-weight: bold;
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

            <button class="large-letter" (click)="scaleChange(true)">+</button>
            <button class="large-letter" (click)="scaleChange(false)">-</button>

            <span id="mode" title="N-neutral\nL-ladders\nH-horizontal points\nV-vertical points\nE-edges\nT-tags">
                {{mode.toUpperCase()}}
            </span>

            <button  (click)="exportData()">Export</button>
            <textarea id="clip"></textarea>
            <button  (click)="importData()">Import</button>

            <table style="display:inline-block; margin-left: 20px;">
                <tr>
                    <td>
                        <input id="coords" [(ngModel)]="coords"/>
                    </td>
                </tr>
                <tr>
                    <td>
                        <input id="tags" [(ngModel)]="tags" (keydown)="tags_keydown($event)"/>
                    </td>
                </tr>

            </table>
            <button (click)="saveSelPointProps()">Save</button>

        </div>`

})

export class DashComponent {

    scale = SCALE_FACTOR ** 4; // initial scale
    mode = 'n';
    floorIndex = 0;
    tags: string = "";
    coords: string = "";

    service: DataService;

    constructor(service: DataService){
        this.service = service;
    }

    @Output()
    onScaleChanged = new EventEmitter<number>();
    @Output()
    onChanged = new EventEmitter();   // just signal to redraw the map

    scaleChange(increased: boolean) {
        let k = increased ? SCALE_FACTOR : 1 / SCALE_FACTOR;
        this.scale *= k;
        this.onScaleChanged.emit(k);
    }

    floorChange(idx: number) {
        this.floorIndex = idx;
        this.onChanged.emit();
    }

    exportData() {
        let el = <HTMLInputElement>document.getElementById("clip");
        el.value = this.service.exportData();
        // data to clipboard
        el.select();
        document.execCommand("copy");
    }

    importData() {
        let el = <HTMLInputElement>document.getElementById("clip");
        this.service.importData(el.value);
        this.onChanged.emit();
    }


    saveSelPointProps() {
        if (this.service.selPoint) {
            this.service.selPoint.tags = this.tags.trim();
            let ss = this.coords.trim().split(',');
            this.service.selPoint.x = +ss[0];
            this.service.selPoint.y = +ss[1];
            this.onChanged.emit();
        }
    }

    tags_keydown(e: KeyboardEvent) {
        if (e.key == "Enter" && this.service.selPoint) {
            this.service.selPoint.tags = this.tags.trim();
            this.onChanged.emit();
        }
    }
}


