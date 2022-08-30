"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCSSString = exports.generate = exports.validate = exports.Validator = exports.Generator = exports.ast = void 0;
const transverser_1 = require("../transverser");
const ast = require("./ast");
exports.ast = ast;
const ast_1 = require("./ast");
const generator_1 = require("./generator");
exports.Generator = generator_1.default;
const validator_1 = require("./validator");
exports.Validator = validator_1.default;
function validate(cssNode) {
    const validator = new validator_1.default();
    new transverser_1.default(ast.CSSNode, cssNode, validator).transverse();
}
exports.validate = validate;
function generate(cssNode) {
    const cssGenerator = new generator_1.default();
    return new transverser_1.default(ast_1.CSSNode, cssNode, cssGenerator).transverse();
}
exports.generate = generate;
function toCSSString(cssNode) {
    validate(cssNode);
    return generate(cssNode);
}
exports.toCSSString = toCSSString;
//# sourceMappingURL=index.js.map