/* eslint-disable @typescript-eslint/no-unused-vars */
import { readFileSync } from "fs";
import { inspect } from "util";

import { CSSNode } from "./src/css/ast";
import { SqssNode } from "./src/sql/ast";
import Lexer from "./src/sql/lexer";
import Parser from "./src/sql/parser";
import SemanticAnalyzer from "./src/sql/semantic-analyzer ";
import TokenStream from "./src/sql/token-stream";
import FlattenCondition from "./src/transformer/flatten-condition";
import NegationSimplifier from "./src/transformer/negation-simplifier";
import SQSSToCSSTransformer from "./src/transformer/sqss-to-css";
import Transverser from "./src/transverser";

testParser();

function testLexer() {
    const sqlString = `UPDATE styles
SET "background"  = 'blue',
    "color"       = 'white',
    "font-family" = '"Droid Sans", serif'
WHERE id = 'target' and (class = 'abc' OR "[title]" is NOT null OR element = 'h1') AND ":hover" is False;

UPDATE styles
SET "background" = 'blue',
    "color"      = 'white'
WHERE class = 'target';

UPDATE styles
SET "background" = 'blue',
    "color"      = 'white'
WHERE element = 'div';

UPDATE styles
SET "background" = 'blue',
    "color"      = 'white';

UPDATE styles
SET "background" = 'blue',
    "color"      = 'white'
WHERE "[title]" IS NOT NULL;

UPDATE styles
SET "background" = 'blue',
    "color"      = 'white'
WHERE "[title]" = 'help test';

UPDATE styles
SET "background" = 'blue',
    "color"      = 'white'
WHERE "[title]" LIKE '%help test';
UPDATE styles
SET "background" = 'blue',
    "color"      = 'white'
WHERE ":hover" = TRUE

UPDATE styles
SET "background" = 'blue',
    "color"      = 'white'
WHERE "::after" = false;`;

    const lexer = new Lexer(sqlString);
    const result = lexer.scan();

    for (const token of result) {
        console.log(token.toString());
        if (token.toString() === ";") {
            console.log("----------------------------------------");
        }
    }
}

function printTree(root: SqssNode | CSSNode, message: string) {
    console.log("\n" + message + ": \n");
    console.log(inspect(root, true, null, true));
    console.log("--------------------------------------------------------------------------------------------------\n");
}

function testParser() {
    const sql = readFileSync("./test.sql", "utf-8");

    const lexer = new Lexer(sql);
    const stream = new TokenStream(lexer);
    const parser = new Parser(stream);

    const root = parser.parse();
    printTree(root, "ORIGINAL TREE");

    const semanticAnalyzer = new SemanticAnalyzer();
    new Transverser<SqssNode, void, null>(SqssNode, root, semanticAnalyzer).transverse(null);

    const negationSimplifier = new NegationSimplifier();
    new Transverser<SqssNode, SqssNode | null, void>(SqssNode, root, negationSimplifier).transverse();
    printTree(root, "AFTER SIMPLIFY NEGATION");

    const flatten = new FlattenCondition();
    new Transverser<SqssNode, void, void>(SqssNode, root, flatten).transverse();
    printTree(root, "AFTER FLATTEN");

    const transpiler = new SQSSToCSSTransformer();
    const cssTree: CSSNode = new Transverser<SqssNode, CSSNode, void>(SqssNode, root, transpiler).transverse();
    printTree(cssTree, "CSS TREE");
}
