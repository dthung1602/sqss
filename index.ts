/* eslint-disable @typescript-eslint/no-unused-vars */
import { readFileSync } from "fs";
import { inspect } from "util";

import { transpileSQSSToCSS } from "./src";
import { CSSNode } from "./src/css/ast";
import Generator from "./src/css/generator";
import Validator from "./src/css/validator";
import { SqssNode } from "./src/sqss/ast";
import Lexer from "./src/sqss/lexer";
import Parser from "./src/sqss/parser";
import SemanticAnalyzer from "./src/sqss/semantic-analyzer ";
import TokenStream from "./src/sqss/token-stream";
import FlattenCondition from "./src/transpiler/flatten-condition";
import NegationSimplifier from "./src/transpiler/negation-simplifier";
import Transpiler from "./src/transpiler/transpiler";
import Transverser from "./src/transverser";

testEveryThing();
// testStepByStep();

function testEveryThing() {
    const sqss = readFileSync("./test.sql", "utf-8");
    const css = transpileSQSSToCSS(sqss);
    console.log(css);
}

function printTree(root: SqssNode | CSSNode, message: string) {
    console.log("\n" + message + ": \n");
    console.log(inspect(root, true, null, true));
    console.log("--------------------------------------------------------------------------------------------------\n");
}

function testStepByStep() {
    const sqss = readFileSync("./test.sql", "utf-8");

    const lexer = new Lexer(sqss);
    const stream = new TokenStream(lexer);
    const parser = new Parser(stream);

    const root = parser.parse();
    printTree(root, "ORIGINAL TREE");

    const semanticAnalyzer = new SemanticAnalyzer();
    new Transverser<SqssNode, void, void>(SqssNode, root, semanticAnalyzer).transverse();

    const negationSimplifier = new NegationSimplifier();
    new Transverser<SqssNode, SqssNode | null, void>(SqssNode, root, negationSimplifier).transverse();
    printTree(root, "AFTER SIMPLIFY NEGATION");

    const flatten = new FlattenCondition();
    new Transverser<SqssNode, SqssNode | null, void>(SqssNode, root, flatten).transverse();
    printTree(root, "AFTER FLATTEN");

    const transpiler = new Transpiler();
    const cssTree: CSSNode = new Transverser<SqssNode, CSSNode, void>(SqssNode, root, transpiler).transverse();
    printTree(cssTree, "CSS TREE");

    const validator = new Validator();
    new Transverser<CSSNode, void, void>(CSSNode, cssTree, validator).transverse();
    printTree(cssTree, "CSS TREE NORMALIZED");

    const cssGenerator = new Generator();
    const css: string = new Transverser<CSSNode, string, void>(CSSNode, cssTree, cssGenerator).transverse();
    console.log("\nFINAL CSS TEXT:\n");
    console.log(css);
}
