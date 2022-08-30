"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Transverser {
    constructor(nodeClass, root, visitor) {
        this.nodeClass = nodeClass;
        this.root = root;
        this.visitor = visitor;
    }
    transverse(context) {
        return this._transverse(this.root, context);
    }
    _transverse(node, context) {
        // @ts-ignore
        const preVisit = this.visitor[`preVisit${node.constructor.name}`];
        if (preVisit instanceof Function) {
            context = preVisit.bind(this.visitor)(node, context);
        }
        const data = {};
        for (const [property, value] of Object.entries(node)) {
            if (value instanceof this.nodeClass) {
                data[property] = this._transverse(value, context);
            }
            else if (Array.isArray(value)) {
                if (value.length === 0) {
                    data[property] = [];
                }
                else if (value[0] instanceof this.nodeClass) {
                    data[property] = value.map((v) => this._transverse(v, context));
                }
            }
        }
        // @ts-ignore
        const name = `postVisit${node.constructor.name}`;
        // @ts-ignore
        const postVisit = this.visitor[name];
        if (!(postVisit instanceof Function)) {
            throw new Error(`Expecting ${this.visitor.constructor.name}.${name} to be a function, found ${postVisit} `);
        }
        return postVisit.bind(this.visitor)(node, context, data);
    }
}
exports.default = Transverser;
//# sourceMappingURL=transverser.js.map