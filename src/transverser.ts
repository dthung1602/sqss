import { Visitor } from "./visitor";

export default class Transverser<Node, Val, Ctx> {
    constructor(
        public nodeClass: { new (...args: any[]): Node },
        public root: Node,
        public visitor: Visitor<Val, Ctx>,
    ) {}

    transverse(context: Ctx): Val {
        return this._transverse(this.root, context);
    }

    private _transverse(node: Node, context: Ctx): Val {
        // @ts-ignore
        const preVisit = this.visitor[`preVisit${node.constructor.name}`];
        if (preVisit instanceof Function) {
            context = preVisit.bind(this.visitor)(node, context);
        }

        const data: Record<string, any> = {};
        for (const [property, value] of Object.entries(node)) {
            if (value instanceof this.nodeClass) {
                data[property] = this._transverse(value, context);
            } else if (Array.isArray(value)) {
                if (value.length === 0) {
                    data[property] = [];
                } else if (value[0] instanceof this.nodeClass) {
                    data[property] = value.map((v) => this._transverse(v, context));
                }
            }
        }

        // @ts-ignore
        const postVisit = this.visitor[`postVisit${node.constructor.name}`];
        return postVisit.bind(this.visitor)(node, context, data);
    }
}
