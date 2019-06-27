import {Component,  ViewChild} from '@angular/core';
import {Point, Edge} from './data/data.types';
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
            cursor: crosshair;
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
            
            <dash (onScaleChanged)="dash_Scaled($event)"
                         (onFloorIndexChanged)="dash_FloorChanged()"></dash>
            
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

export class MainComponent {

    @ViewChild(DashComponent, {static: false})
    dash: DashComponent;

    // privates
    bgImages: HTMLImageElement[];
    scrollBox: HTMLElement;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    info: string = "";

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
        let fli = this.dash.floorIndex;
        let img = this.bgImages[fli];
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

        for (let p of this.service.points.filter(p => p.z == fli )) {
            this.ctx.fillRect(p.x * scl - 0.5, p.y * scl - 0.5, 1, 1 );
            this.ctx.strokeRect((p.x - 1) * scl, (p.y - 1) * scl, 2 * scl, 2 * scl );
        }
        // draw edges
        this.ctx.beginPath();
        for (let e of this.service.edges.filter(e => e.a.z == fli )) {
            this.ctx.moveTo(e.a.x * scl, e.a.y * scl);
            this.ctx.lineTo(e.b.x * scl, e.b.y * scl);
        }
        this.ctx.stroke();

        // draw selected point
        if (this.service.selPoint && this.service.selPoint.z == fli) {
            this.ctx.strokeStyle = 'red';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(
                (this.service.selPoint.x - 2) * scl,
                (this.service.selPoint.y - 2) * scl, 4 * scl, 4 * scl);
        }
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
        // this.info = `${x}  ${y}`;
    }

    this_mousedown(e: MouseEvent) {
        let x = Math.round(e.offsetX / this.dash.scale);
        let y = Math.round(e.offsetY / this.dash.scale);
        let mode = this.dash.mode;
        if ( mode == 'h' || mode == 'v' || mode == 'l') {
            this.this_mousedown_lhv(x, y, mode);
        }
        this.redraw();
    }


    private this_mousedown_lhv(x: number, y: number, mode: string) {
        let fli = this.dash.floorIndex;
        let near: Point = this.service.nearPointTo(x, y, fli);
        if (near) {
            // near point exists
            this.service.selPoint = near;
            this.info = `Select point: x = ${x} y = ${y}`;
        } else {
            // a new point
            let sel = this.service.selPoint;
            if (sel && mode == 'h') {
                this.service.addPoint(new Point(x, sel.y, fli));
            }
            if (sel && mode == 'v') {
                this.service.addPoint(new Point(sel.x, y, fli));
            }
            if (mode == 'l') {
                for (let i = 0; i < 6; i++) {
                    this.service.addPoint(new Point(x, y, i));
                    //todo: edges add too
                }
            }

            this.info = `New point`;
        }
    }

    this_keydown(e: KeyboardEvent) {
        switch (e.key.toLowerCase()) {
            case "delete":
                this.service.deleteSelPoint();
                this.redraw();
                this.info = `Point was deleted`;
                break;
            case "h": case "v": case "n": case "l": case "e": case "t":
                this.dash.mode = e.key;
        }
    }

    // child's event handlers ///////////////////////

    dash_Scaled(k: number) {
        const w = screen.width / 2;
        const h = (screen.height - DASH_HEIGHT) / 2;
        this.scrollBox.scrollLeft = (this.scrollBox.scrollLeft + w) * k - w;
        this.scrollBox.scrollTop = (this.scrollBox.scrollTop + h) * k - h;
        this.redraw();
    }

    dash_FloorChanged() {
        this.service.selPoint = null;
        this.redraw();
        this.info = `Floor changed: ${this.dash.floorIndex + 1} now.}`;

    }

}
