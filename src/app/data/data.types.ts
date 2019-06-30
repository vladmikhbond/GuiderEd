
export class Point
{
    // z is floor index (from 0 to 5)
    constructor(public x: number, public y: number, public z: number, public tags: string = "") {
    }

    // equals(p: Point): boolean {
    //     return this.x == p.x && this.y == p.y && this.z == p.z;
    // }
}

export class Edge
{
    constructor(public a: Point, public b: Point) {
        let s = (a.x === b.x ? 1 : 0) + (a.y === b.y ? 1: 0) + (a.z === b.z ? 1: 0);
        if (s !== 2)
            throw new Error("bad edge");
    }

    get isHor():boolean {
        return this.a.z == this.b.z && this.a.y == this.b.y;
    }
    get isVer():boolean {
        return this.a.z == this.b.z && this.a.x == this.b.x;
    }

    // Check if a point (x, y) belong or close to this edge
    hasPoint(x: number, y: number): boolean {
        if (this.isHor)
            return (this.a.x < x && x < this.b.x || this.a.x > x && x > this.b.x) && Math.abs(this.a.y - y) < 2;
        if (this.isVer)
            return (this.a.y < y && y < this.b.y || this.a.y > y && y > this.b.y) && Math.abs(this.a.x - x) < 2;
        return false;
    }

    // get len(): number {
    //     if (this.a.x !== this.b.x)
    //         return Math.abs(this.a.x - this.b.x);
    //     if (this.a.y !== this.b.y)
    //         return Math.abs(this.a.y - this.b.y);
    //     return Math.abs(this.a.z - this.b.z) * 10;
    // }
}
