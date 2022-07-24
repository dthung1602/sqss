import Lexer from "./lexer";

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
WHERE "[title]" LIKE '%help test';`;

const lexer = new Lexer(sqlString);
const result = lexer.scan();

for (const token of result) {
    console.log(token.toString());
}
