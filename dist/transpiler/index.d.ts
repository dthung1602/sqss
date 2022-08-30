import { CSSNode } from "../css/ast";
import { SqssNode } from "../sqss/ast";
import FlattenExpression from "./flatten-expression";
import NegationSimplifier from "./negation-simplifier";
import Transpiler from "./transpiler";
export { FlattenExpression, NegationSimplifier, Transpiler };
export declare function simplifyNegation(sqssNode: SqssNode): void;
export declare function flattenExpression(sqssNode: SqssNode): void;
export declare function transpile(sqssNode: SqssNode): CSSNode;
