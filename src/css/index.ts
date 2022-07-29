import Transverser from "../transverser";
import * as ast from "./ast";
import { CSSNode } from "./ast";
import Generator from "./generator";
import Validator from "./validator";

export { ast, Generator, Validator };

export function validate(cssNode: ast.CSSNode) {
    const validator = new Validator();
    new Transverser<ast.CSSNode, void, void>(ast.CSSNode, cssNode, validator).transverse();
}

export function generate(cssNode: ast.CSSNode): string {
    const cssGenerator = new Generator();
    return new Transverser<CSSNode, string, void>(CSSNode, cssNode, cssGenerator).transverse();
}

export function toCSSString(cssNode: ast.CSSNode): string {
    validate(cssNode);
    return generate(cssNode);
}
