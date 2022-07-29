import { toCSSString } from "./css";
import { toAST } from "./sqss";
import { transpile } from "./transpiler";

export function transpileSQSSToCSS(sqss: string): string {
    return toCSSString(transpile(toAST(sqss)));
}
