import {Component,  ViewChild} from '@angular/core';
import {Point} from './data/point';
import {EditorService} from "./data/editor.service";
import {DashComponent} from './dash.component';

const DASH_HEIGHT = 50;
const INFO_HEIGHT = 30;

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
                         (onFloorChanged)="dash_FloorChanged($event)"></editor-dash>
            <div id="info">{{info}}</div>
            <div id="scrollBox" (scroll)="onScroll($event)">
                <canvas id="canvas" (mousemove)="this_mousemove($event)" (mousedown)="this_mousedown($event)"></canvas>
            </div>

            <img id="floor1" [src]="'assets/floors/1.svg'" (load)="init()" hidden alt="floor1"/>
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
    scaleField = 1;
    currentFloorIndex = 0;
    service: EditorService;
    private mode: string;

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
        let img = this.currentFloor;
        let k = this.scaleField;
        // canvas size
        this.canvas = <HTMLCanvasElement>document.getElementById("canvas");
        this.canvas.width = img.width * k;
        this.canvas.height = img.height * k;

        // draw back image
        this.ctx = this.canvas.getContext("2d");
        this.ctx.drawImage(img,
            0, 0, img.width, img.height,
            0, 0, this.canvas.width, this.canvas.height);

        // draw points
        this.ctx.lineWidth = 0.5;

        for (let p of this.service.points.filter(p => p.z == this.currentFloorIndex )) {
            this.ctx.fillRect(p.x * k - 0.5, p.y * k - 0.5, 1, 1 );
            this.ctx.strokeRect((p.x - 1) * k, (p.y - 1) * k, 2 * k, 2 * k );
        }
        // draw selected point
        if (this.service.selPoint && this.service.selPoint.z == this.currentFloorIndex) {
            this.ctx.strokeStyle = 'red';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(
                (this.service.selPoint.x - 1) * k,
                (this.service.selPoint.y - 1) * k, 2 * k, 2 * k);
        }
    }


    onScroll(e: Event) {
        let x = (<HTMLElement>e.target).scrollLeft;
        let y = (<HTMLElement>e.target).scrollTop;
        this.info = `scrollX: ${x | 0}    scrollY:  ${y | 0}`;
    }

    // props ////////////////////////////////////

    set scale(newScale: number) {
        const k = newScale / this.scaleField;
        const w = screen.width / 2;
        const h = (screen.height - DASH_HEIGHT) / 2;
        this.scrollBox.scrollLeft = (this.scrollBox.scrollLeft + w) * k - w;
        this.scrollBox.scrollTop = (this.scrollBox.scrollTop + h) * k - h;

        this.scaleField = newScale;
        this.redraw();
    }

    get scale() {
        return this.scaleField;
    }

    get currentFloor() {
        return this.bgImages[this.currentFloorIndex];
    }

    // this event handlers ///////////////////////

    this_mousemove(e: MouseEvent) {
        let x = Math.round(e.offsetX / this.scaleField);
        let y = Math.round(e.offsetY / this.scaleField);
        this.info = `${x}  ${y}`;
    }

    this_mousedown(e: MouseEvent) {
        let x = Math.round(e.offsetX / this.scaleField);
        let y = Math.round(e.offsetY / this.scaleField);
        if (this.dash.mode == 'h' || this.dash.mode == 'v')
            this.mousedownPoints(x, y);
        this.redraw();
    }


    private mousedownPoints(x: number, y: number) {
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
            case "h": case "v":
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
