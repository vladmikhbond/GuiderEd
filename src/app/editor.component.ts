import {Component,  ViewChild} from '@angular/core';
import {Point} from './data/point';
import {EditorService} from "./data/editor.service";
import {DashComponent} from './dash.component';

const DASH_HEIGHT = 50;
const INFO_HEIGHT = 30;
/*******************************************************************************
 *
 * Properties:
 * scale: number
 *
 ********************************************************************************/

@Component({
    selector: 'editor',
    styles: [`
        canvas {
        }
        #info {
            height: 30px;
        }
        #scrollBox {
            width: 100%;
            min-width: 320px;
            overflow: auto;
        }
    `],
    template: `
        <div (keydown)="this_keydown($event)" tabindex="1">
            <editor-dash (onScaleChanged)="dash_Scaled($event)"
                         (onFloorIndexChanged)="dash_FloorChanged($event)"></editor-dash>
            <div id="info">{{info}}</div>
            <div id="scrollBox" (scroll)="this_scroll($event)">
                <canvas id="canvas" (mousemove)="this_mousemove($event)" (mousedown)="this_mousedown($event)"></canvas>
            </div>

            <img id="floor1" [src]="'assets/floors/1ed.svg'" (load)="init()" hidden alt="floor1"/>
            <img id="floor2" [src]="'assets/floors/2.svg'" hidden alt="floor2"/>
            <img id="floor3" [src]="'assets/floors/3.svg'" hidden alt="floor3"/>
            <img id="floor4" [src]="'assets/floors/4.svg'" hidden alt="floor4"/>
            <img id="floor5" [src]="'assets/floors/5.svg'" hidden alt="floor5"/>
            <img id="floor6" [src]="'assets/floors/6.svg'" hidden alt="floor6"/>
        </div>
    `
})
export class EditorComponent {

    @ViewChild(DashComponent, {static: false})
    dash: DashComponent;

    // privates
    bgImages: HTMLImageElement[];
    scrollBox: HTMLElement;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    info: string = "";

    currentFloorIndex = 0;
    service: EditorService;


    constructor(editorService: EditorService){
        this.service = editorService;
    }


    init() {
        // fill array of images
        this.bgImages = [];
        for (let i = 1; i <= 6; i++ ) {
            let im = <HTMLImageElement>document.getElementById("floor" + i);
            this.bgImages.push(im);
        }
        // set scrollBox size
        this.scrollBox = document.getElementById("scrollBox");
        this.scrollBox.style.height = `${screen.height - DASH_HEIGHT - INFO_HEIGHT}px`;
        this.redraw();
    }


    redraw(): void {
        let img = this.bgImages[this.currentFloorIndex];
        let scl = this.dash.scale;
        // canvas size
        this.canvas = <HTMLCanvasElement>document.getElementById("canvas");
        this.canvas.width = img.width * scl;
        this.canvas.height = img.height * scl;

        // draw back image
        this.ctx = this.canvas.getContext("2d");
        this.ctx.drawImage(img,
            0, 0, img.width, img.height,
            0, 0, this.canvas.width, this.canvas.height);

        // draw points
        this.ctx.lineWidth = 0.5;

        for (let p of this.service.points.filter(p => p.z == this.currentFloorIndex )) {
            this.ctx.fillRect(p.x * scl - 0.5, p.y * scl - 0.5, 1, 1 );
            this.ctx.strokeRect((p.x - 1) * scl, (p.y - 1) * scl, 2 * scl, 2 * scl );
        }
        // draw selected point
        if (this.service.selPoint && this.service.selPoint.z == this.currentFloorIndex) {
            this.ctx.strokeStyle = 'red';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(
                (this.service.selPoint.x - 1) * scl,
                (this.service.selPoint.y - 1) * scl, 2 * scl, 2 * scl);
        }
    }


    // props ////////////////////////////////////

    set scale(newScale: number) {
        const k = newScale / this.dash.scale;
        const w = screen.width / 2;
        const h = (screen.height - DASH_HEIGHT) / 2;
        this.scrollBox.scrollLeft = (this.scrollBox.scrollLeft + w) * k - w;
        this.scrollBox.scrollTop = (this.scrollBox.scrollTop + h) * k - h;

        this.dash.scale = newScale;
        this.redraw();
    }

    // this event handlers ///////////////////////

    this_scroll(e: Event) {
        let x = (<HTMLElement>e.target).scrollLeft;
        let y = (<HTMLElement>e.target).scrollTop;
        this.info = `scrollX: ${x | 0}    scrollY:  ${y | 0}`;
    }

    this_mousemove(e: MouseEvent) {
        let x = Math.round(e.offsetX / this.dash.scale);
        let y = Math.round(e.offsetY / this.dash.scale);
        this.info = `${x}  ${y}`;
    }

    this_mousedown(e: MouseEvent) {
        let x = Math.round(e.offsetX / this.dash.scale);
        let y = Math.round(e.offsetY / this.dash.scale);
        if (this.dash.mode == 'h' || this.dash.mode == 'v')
            this.hv_mousedown(x, y);
        this.redraw();
    }


    private hv_mousedown(x: number, y: number) {
        // if point exist
        let near: Point = this.service.nearPointTo(x, y, this.currentFloorIndex);
        if (near) {
            this.service.selPoint = near;
        } else {
            let p = new Point(x, y, this.currentFloorIndex);
            this.service.addPoint(p);
        }
    }




    this_keydown(e: KeyboardEvent) {
        switch (e.key) {
            case "Delete":
                this.service.deleteSelPoint();
                this.redraw();
                break;
            case "h": case "v": case "n":
                this.dash.mode = e.key;
        }
    }
    // child's event handlers ///////////////////////

    dash_Scaled(newScale: number) {
        this.scale = newScale;
    }

    dash_FloorChanged(newIndex: number) {
        this.currentFloorIndex = newIndex;
        this.redraw();
    }
}
