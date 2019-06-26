import { Component, EventEmitter, Output} from '@angular/core';

const SCALE_FACTOR = 1.2;

/*******************************************************************************
 *
 * Output Events
 * onScaleChanged()   : scale
 * onFloorChanged()   : 0,1,2,3,4,5
 * onModeChanged()    : horPoints, verPoints, ladders, eidges, tags
 *
 * Privat Properties:
 * scale: number
 *
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
                <mat-select (valueChange)="floorChange($event)" [value]="0">
                    <mat-option *ngFor="let i of [1,2,3,4,5,6]" [value]="i-1">
                        {{i}}
                    </mat-option>
                </mat-select>
            </mat-form-field>

            <button mat-stroked-button (click)="scaleChange(true)">+</button>
            <button mat-stroked-button (click)="scaleChange(false)">-</button>
        </div>`

})
export class EditorDashComponent {

    scale = 1;

    @Output() onScaleChanged = new EventEmitter<number>();
    scaleChange(increased: boolean) {
        this.scale *= increased ? SCALE_FACTOR : 1 / SCALE_FACTOR;
        this.onScaleChanged.emit(this.scale);
    }

    @Output() onFloorChanged = new EventEmitter<number>();
    floorChange(idx: number) {
        this.onFloorChanged.emit(idx);
    }

}