import { CSSNode } from "../css/ast";
import { SqssNode } from "../sqss/ast";
import Transverser from "../transverser";
import FlattenCondition from "./flatten-condition";
import NegationSimplifier from "./negation-simplifier";
import Transpiler from "./transpiler";

export { FlattenCondition, NegationSimplifier, Transpiler };

export function simplifyNegation(sqssNode: SqssNode) {
    const negationSimplifier = new NegationSimplifier();
    new Transverser<SqssNode, SqssNode | null, void>(SqssNode, sqssNode, negationSimplifier).transverse();
}

export function flattenCondition(sqssNode: SqssNode) {
    const flatten = new FlattenCondition();
    new Transverser<SqssNode, SqssNode | null, void>(SqssNode, sqssNode, flatten).transverse();
}

export function transpile(sqssNode: SqssNode): CSSNode {
    simplifyNegation(sqssNode);
    flattenCondition(sqssNode);
    const transpiler = new Transpiler();
    return new Transverser<SqssNode, CSSNode, void>(SqssNode, sqssNode, transpiler).transverse();
}
