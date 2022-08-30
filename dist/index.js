"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transpileSQSSToCSS = void 0;
const css_1 = require("./css");
const sqss_1 = require("./sqss");
const transpiler_1 = require("./transpiler");
function transpileSQSSToCSS(sqss) {
    const sqssNode = (0, sqss_1.toAST)(sqss);
    const cssNode = (0, transpiler_1.transpile)(sqssNode);
    return (0, css_1.toCSSString)(cssNode);
}
exports.transpileSQSSToCSS = transpileSQSSToCSS;
//# sourceMappingURL=index.js.map