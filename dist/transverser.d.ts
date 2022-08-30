import { Visitor } from "./visitor";
export default class Transverser<Node, Val, Ctx> {
    nodeClass: {
        new (...args: any[]): Node;
    };
    root: Node;
    visitor: Visitor<Val, Ctx>;
    constructor(nodeClass: {
        new (...args: any[]): Node;
    }, root: Node, visitor: Visitor<Val, Ctx>);
    transverse(context: Ctx): Val;
    private _transverse;
}
