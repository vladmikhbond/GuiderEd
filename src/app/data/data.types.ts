
export class Point
{
    tags: string[];

    // z is floor index (from 0 to 5)
    constructor(public x: number, public y: number, public z: number) {
        this.tags = []
    }
}

export class Edge
{
    constructor(public a: Point, public b: Point) {
        let s = (a.x === b.x ? 1 : 0) + (a.y === b.y ? 1: 0) + (a.z === b.z ? 1: 0);
        if (s !== 2)
            throw new Error("bad adge");
    }

    get len(): number {
        if (this.a.x !== this.b.x)
            return Math.abs(this.a.x - this.b.x);
        if (this.a.y !== this.b.y)
            return Math.abs(this.a.y - this.b.y);
        return Math.abs(this.a.z - this.b.z) * 10;
    }
}
