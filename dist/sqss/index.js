"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toAST = exports.analyze = exports.parse = exports.tokenize = exports.TokenStream = exports.token = exports.SemanticAnalyzer = exports.Parser = exports.Lexer = exports.ast = void 0;
const transverser_1 = require("../transverser");
const ast = require("./ast");
exports.ast = ast;
const ast_1 = require("./ast");
const lexer_1 = require("./lexer");
exports.Lexer = lexer_1.default;
const parser_1 = require("./parser");
exports.Parser = parser_1.default;
const semantic_analyzer_1 = require("./semantic-analyzer ");
exports.SemanticAnalyzer = semantic_analyzer_1.default;
const token = require("./token");
exports.token = token;
const token_stream_1 = require("./token-stream");
exports.TokenStream = token_stream_1.default;
function tokenize(sqss) {
    return new token_stream_1.default(new lexer_1.default(sqss));
}
exports.tokenize = tokenize;
function parse(tokenStream) {
    return new parser_1.default(tokenStream).parse();
}
exports.parse = parse;
function analyze(sqssNode) {
    const semanticAnalyzer = new semantic_analyzer_1.default();
    new transverser_1.default(ast_1.SqssNode, sqssNode, semanticAnalyzer).transverse({});
}
exports.analyze = analyze;
function toAST(sqss) {
    const root = parse(tokenize(sqss));
    analyze(root);
    return root;
}
exports.toAST = toAST;
//# sourceMappingURL=index.js.map