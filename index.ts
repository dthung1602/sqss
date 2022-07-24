import Lexer from "./lexer";
import TokenStream from "./token-stream";
import Parser from "./parser";

testParser();

function testLexer() {
    const sqlString = `UPDATE styles
SET "background"  = 'blue',
    "color"       = 'white',
    "font-family" = '"Droid Sans", serif'
WHERE id = 'target';

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
    }
}

function testParser() {
    const sql = `UPDATE styles
SET "background"  = 'blue',
    "color"       = 'white',
    "font-family" = '"Droid Sans", serif'
WHERE id = 'target';`;

    const lexer = new Lexer(sql);
    const stream = new TokenStream(lexer);
    const parser = new Parser(stream);

    const root = parser.parse();
    console.log(root);
}
