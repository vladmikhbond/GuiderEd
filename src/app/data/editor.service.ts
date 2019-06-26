//import {contains} from 'underscore';
import {Point} from "./point";

export class EditorService {

    points: Point[] = [];

    selPoint: Point = null;

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
