import { toCSSString } from "./css";
import { toAST } from "./sqss";
import { transpile } from "./transpiler";

/**
 * This file exposes the transpile function in the sqss package
 * Other projects can import the transpile function from here
 */

export function transpileSQSSToCSS(sqss: string): string {
    const sqssNode = toAST(sqss);
    const cssNode = transpile(sqssNode);
    return toCSSString(cssNode);
}
