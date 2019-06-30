import {Point, Edge} from "./data.types";
import {obj} from "./data";

const EPSILON = 2;

export class DataService {

    points: Point[];
    edges: Edge[];

    selPoint: Point = null;
    selEdge: Edge = null;

    constructor() {
         this.parse(obj);
    }

    parse(obj: any) {
        this.selPoint = this.selEdge = null;
        // create points
        this.points = [];
        for (let i = 0; i < obj.points.length; i++) {
            let p = obj.points[i];
            let tag = obj.tags[i] == null ? "" : obj.tags[i];
            this.points.push(new Point(p[0], p[1], p[2], tag));
        }

        // create edges
        this.edges = [];
        for (let a of obj.edges) {
            let p1 = this.points.find(p => p.x == a[0] && p.y == a[1] && p.z == a[2]);
            let p2 = this.points.find(p => p.x == a[3] && p.y == a[4] && p.z == a[5]);
            if (p1 && p2) {
                this.edges.push(new Edge(p1, p2));
            } else {
                console.error(`cannot create Edge`, a);
            }
        }
    }

    //////////////////////// points //////////////////////

    private indexOfPoint(point: Point):number {
        return this.points.findIndex(p => p.x === point.x && p.y === point.y && p.z === point.z);
    }

    // Add a point with unique place
    //
    addPoint(newPoint: Point) {
        let idx = this.indexOfPoint(newPoint);
        if (idx === -1)
            this.points.push(newPoint);
        this.selPoint = newPoint;
    }

    deletePoint(p: Point) {
        let idx = this.indexOfPoint(p);
        if (idx === -1)
            return;
        // delete point's edges
        let es = this.edges;
        for (let i = 0; i < es.length; ) {
            if (es[i].a == p || es[i].b == p)
                es.splice(i, 1);
            else
                i++;
        }
        // delete point
        let ps = this.points;
        ps.splice(idx, 1);
    }

    deleteSelectedPoint() {
        if (this.selPoint) {
            this.deletePoint(this.selPoint);
            this.selPoint = null;
        }
    }


    nearPointTo(x: number, y: number, z: number): Point {
        return this.points.find(p => Math.abs(p.x - x) < EPSILON && Math.abs(p.y - y) < EPSILON && p.z == z);
    }

    //////////////////////// ladders //////////////////////

    // Add ladder block and do point (x,y,z) selected.
    //
    addLadders(x: number, y: number, z: number) {
        let a = new Point(x, y, 0, "L");
        let sel = a;
        this.addPoint(a);
        for (let i = 1; i < 6; i++) {
            let b = new Point(x, y, i, "L");
            this.addPoint(b);
            this.edges.push(new Edge(a, b));
            a = b;
            if (i == z)
                sel = a;
        }
        this.selPoint = sel;
    }

    deleteSelectedLadder() {
        if (this.selPoint && this.selPoint.tags.startsWith("L") ) {
            this.points.filter(p => p.x == this.selPoint.x && p.y == this.selPoint.y)
                .forEach(p => this.deletePoint(p));
            this.selPoint = null;
        }
    }

    //////////////////////// edges //////////////////////

    addEdge(newEdge: Edge) {
        this.edges.push(newEdge);
        this.selEdge = newEdge;
    }

    trySelectEdge(x: number, y: number, z: number): boolean {
        let idx = this.edges.filter(e => e.a.z == z && e.b.z == z) // all edges on z-floor
            .findIndex(e => e.hasPoint(x, y));
        if (idx != -1) {
            this.selEdge = this.edges[idx];
            return true;
        }
        return false;
    }


    deleteSelectedEdge() {
        if (this.selEdge) {
            let idx = this.edges.indexOf(this.selEdge);
            if (idx != -1) {
                this.edges.splice(idx, 1);
                this.selEdge = null;
            }
        }
    }

    tryCreateEdge(x: number, y: number, z: number): boolean
    {
        let pointsOnFloor = this.points.filter(p => p.z == z);
        // try a horizontal edge
        let lefts = pointsOnFloor.filter(p => Math.abs(p.y - y) < 2 && p.x < x);
        let rights = pointsOnFloor.filter(p => Math.abs(p.y - y) < 2 && p.x > x);
        if (lefts.length > 0 && rights.length > 0) {
            lefts.sort((a, b) => b.x - a.x);
            rights.sort((a, b) => a.x - b.x);
            this.addEdge(new Edge(lefts[0], rights[0]));
            return true;
        }
        // try a vertical edge
        let tops = pointsOnFloor.filter(p => Math.abs(p.x - x) < 2 && p.y < y);
        let bots = pointsOnFloor.filter(p => Math.abs(p.x - x) < 2 && p.y > y);
        if (tops.length > 0 && bots.length > 0) {
            tops.sort((a, b) => b.y - a.y);
            bots.sort((a, b) => a.y - b.y);
            this.addEdge(new Edge(tops[0], bots[0]));
            return true;
        }
        return false;
    }

    //////////////////////// data //////////////////////

    exportData() {
        let ps = this.points.map(p => [p.x, p.y, p.z] );
        let ts = this.points.map(p => p.tags );
        let es = this.edges.map(e => [e.a.x, e.a.y, e.a.z, e.b.x, e.b.y, e.b.z] );
        return JSON.stringify({"points": ps, "tags": ts, "edges": es});
    }

    importData(jsonStr: string) {
        try {
            const obj = JSON.parse(jsonStr);
            if (confirm("Current data will be lost. Continue?")) {
                this.parse(obj);
            }
        } catch (err) {
            alert(err);
        }
    }

}

