import { inspect } from "util";
import { readFileSync } from "fs";

import Lexer from "./src/sql/lexer";
import TokenStream from "./src/sql/token-stream";
import Parser from "./src/sql/parser";
import Transverser from "./src/sql/transverser";

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

function testParser() {
    const sql = readFileSync("./test.sql", "utf-8");

    const lexer = new Lexer(sql);
    const stream = new TokenStream(lexer);
    const parser = new Parser(stream);

    const root = parser.parse();
    console.log(inspect(root, true, null, true));

    const transverser = new Transverser(root);
    transverser.transverse();
}
