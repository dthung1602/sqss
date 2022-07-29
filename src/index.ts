import { toCSSString } from "./css";
import { toAST } from "./sqss";
import { transpile } from "./transpiler";

export function transpileSQSSToCSS(sqss: string): string {
    const sqssNode = toAST(sqss);
    const cssNode = transpile(sqssNode);
    return toCSSString(cssNode);
}
