import { CSSNode } from "../css/ast";
import { SqssNode } from "../sqss/ast";
import Transverser from "../transverser";
import FlattenExpression from "./flatten-expression";
import NegationSimplifier from "./negation-simplifier";
import Transpiler, { TPContext } from "./transpiler";

export { FlattenExpression, NegationSimplifier, Transpiler };

export function simplifyNegation(sqssNode: SqssNode) {
    const negationSimplifier = new NegationSimplifier();
    new Transverser<SqssNode, SqssNode | null, void>(SqssNode, sqssNode, negationSimplifier).transverse();
}

export function flattenExpression(sqssNode: SqssNode) {
    const flatten = new FlattenExpression();
    new Transverser<SqssNode, SqssNode | null, void>(SqssNode, sqssNode, flatten).transverse();
}

export function transpile(sqssNode: SqssNode): CSSNode {
    simplifyNegation(sqssNode);
    flattenExpression(sqssNode);
    const transpiler = new Transpiler();
    return new Transverser<SqssNode, CSSNode, TPContext>(SqssNode, sqssNode, transpiler).transverse({});
}
