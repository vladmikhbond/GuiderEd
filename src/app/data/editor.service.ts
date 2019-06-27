//import {contains} from 'underscore';
import {Point, Edge} from "./data.types";
import {points, edges} from "./data";

export class EditorService {

    points: Point[];
    edges: Edge[];

    selPoint: Point = null;

    constructor() {
        this.points = [];
        for (let a of points) {
            this.points.push(new Point(a[0], a[1], a[2]));
        }

        this.edges = [];
        for (let a of edges) {
            let p1 = this.points.find(p => p.x == a[0] && p.y == a[1] && p.z == a[2]);
            let p2 = this.points.find(p => p.x == a[3] && p.y == a[4] && p.z == a[5]);
            if (p1 && p2) {
                this.edges.push(new Edge(p1, p2));
            } else {
                console.error(`cannot create Edge`, a);
            }

        }

    }

    private indexOfPoint(point: Point) {
        return this.points.findIndex(p => p.x === point.x && p.y === point.y && p.z === point.z);
    }

    // all places of points must be unique
    addPoint(newPoint: Point) {
        let idx = this.indexOfPoint(newPoint);
        if (idx === -1)
            this.points.push(newPoint);
        this.selPoint = newPoint;
    }

    deleteSelPoint() {
        if (this.selPoint) {
            let ps = this.points;
            let idx = this.indexOfPoint(this.selPoint);
            if (idx != -1) {
                ps.splice(idx, 1);
                this.selPoint = ps.length == 0 ? null : ps[ps.length - 1];
            }
        }
    }

    nearPointTo(x: number, y: number, z: number): Point {
        return this.points.find(p => Math.abs(p.x - x) < 3 && Math.abs(p.y - y) < 3 && p.z == z);
    }
}
