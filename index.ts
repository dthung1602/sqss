import Lexer from "./lexer";

const sqlString = `UPDATE styles
SET "background"  = 'blue',
    "color"       = 'white',
    "font-family" = '"Droid Sans", serif'
WHERE id = 'target';`;

const lexer = new Lexer(sqlString);
const result = lexer.scan();

for (const token of result) {
    console.log(token.toString());
}
