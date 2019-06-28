import { Component, EventEmitter, Output} from '@angular/core';
import {EditorService} from "./data/editor.service";

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
            margin: 0;
        }
        #mode {
            font-size: 20px;
            margin: 0 10px 0 10px;
            text-align: center;
        }
        mat-form-field, button, #clip {
            min-width: 50px;
            min-height: 50px;
            width: 50px;
            height: 50px;
            background-color: white;
            border: solid thin lightblue;
            vertical-align: top;
            margin-left: 2px;
            padding: 2px;
        }

        mat-form-field{
            font-size: 14px;
        }
        
        textarea {
             width: 100px;
             z-index: -100;
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
            <span id="mode"
                  title="L'adder points\nH'orizontal points\nV'ertical points\nE'dges\nT'ags\nN'one">mode: {{mode.toUpperCase()}}</span>
            <button mat-stroked-button (click)="exportData()">Export</button>
            <textarea id="clip"></textarea>
            <button mat-stroked-button (click)="importData()">Import</button>
        </div>`

})

export class DashComponent {

    scale = SCALE_FACTOR ** 4; // initial scale
    mode = 'n';
    floorIndex = 0;

    service: EditorService;

    constructor(editorService: EditorService){
        this.service = editorService;
    }

    @Output()
    onScaleChanged = new EventEmitter<number>();
    @Output()
    onChanged = new EventEmitter();   // signal to redraw the map

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

}


