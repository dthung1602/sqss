"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const token_1 = require("./token");
const ExactMatchTokens = [
    token_1.TokenUpdate,
    token_1.TokenSet,
    token_1.TokenWhere,
    token_1.TokenSemiColon,
    token_1.TokenComma,
    token_1.TokenOpenParenthesis,
    token_1.TokenCloseParenthesis,
    token_1.TokenNot,
    token_1.TokenEqual,
    token_1.TokenNotEqual,
    token_1.TokenLike,
    token_1.TokenIs,
    token_1.TokenAnd,
    token_1.TokenOr,
    token_1.TokenNull,
    token_1.TokenTrue,
    token_1.TokenFalse,
    token_1.TokenJoin,
    token_1.TokenAs,
    token_1.TokenOn,
];
const RegexMatchTokens = [token_1.TokenNumber, token_1.TokenIdentifier, token_1.TokenString, token_1.TokenComment];
class Lexer {
    constructor(input) {
        this.input = input;
    }
    scan() {
        const result = [];
        let token = this.next();
        while (token != null) {
            result.push(token);
            token = this.next();
        }
        return result;
    }
    next() {
        if (this.input === "") {
            return null;
        }
        let result = this.matchExact();
        if (result === null) {
            result = this.matchRegex();
            if (result === null) {
                throw new Error(`Invalid syntax: ${(0, utils_1.trunkString)(this.input, 20)}`);
            }
        }
        this.input = this.input.slice(result.shiftLen).trimStart();
        return result.token;
    }
    matchExact() {
        for (const TokenClass of ExactMatchTokens) {
            const len = TokenClass.value.length;
            const str = this.input.slice(0, len).toUpperCase();
            const after = this.input.slice(len, len + 1);
            if (str === TokenClass.value && (Lexer.isWord(str) ? Lexer.isSeparator(after) : true)) {
                return {
                    token: new TokenClass(),
                    shiftLen: len,
                };
            }
        }
        return null;
    }
    static isWord(s) {
        return Boolean(s.match(/^\w/u));
    }
    static isSeparator(s) {
        return Boolean(s.match(/^\W/u));
    }
    matchRegex() {
        for (const TokenClass of RegexMatchTokens) {
            const match = this.input.match(TokenClass.regex);
            if (match !== null) {
                return {
                    // @ts-ignore
                    token: new TokenClass(match[0]),
                    shiftLen: match[0].length,
                };
            }
        }
        return null;
    }
}
exports.default = Lexer;
//# sourceMappingURL=lexer.js.map