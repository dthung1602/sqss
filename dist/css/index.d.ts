import * as ast from "./ast";
import Generator from "./generator";
import Validator from "./validator";
export { ast, Generator, Validator };
export declare function validate(cssNode: ast.CSSNode): void;
export declare function generate(cssNode: ast.CSSNode): string;
export declare function toCSSString(cssNode: ast.CSSNode): string;
