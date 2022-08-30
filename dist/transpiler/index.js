"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transpile = exports.flattenExpression = exports.simplifyNegation = exports.Transpiler = exports.NegationSimplifier = exports.FlattenExpression = void 0;
const ast_1 = require("../sqss/ast");
const transverser_1 = require("../transverser");
const flatten_expression_1 = require("./flatten-expression");
exports.FlattenExpression = flatten_expression_1.default;
const negation_simplifier_1 = require("./negation-simplifier");
exports.NegationSimplifier = negation_simplifier_1.default;
const transpiler_1 = require("./transpiler");
exports.Transpiler = transpiler_1.default;
function simplifyNegation(sqssNode) {
    const negationSimplifier = new negation_simplifier_1.default();
    new transverser_1.default(ast_1.SqssNode, sqssNode, negationSimplifier).transverse();
}
exports.simplifyNegation = simplifyNegation;
function flattenExpression(sqssNode) {
    const flatten = new flatten_expression_1.default();
    new transverser_1.default(ast_1.SqssNode, sqssNode, flatten).transverse();
}
exports.flattenExpression = flattenExpression;
function transpile(sqssNode) {
    simplifyNegation(sqssNode);
    flattenExpression(sqssNode);
    const transpiler = new transpiler_1.default();
    return new transverser_1.default(ast_1.SqssNode, sqssNode, transpiler).transverse({});
}
exports.transpile = transpile;
//# sourceMappingURL=index.js.map