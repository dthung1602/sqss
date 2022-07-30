import { trunkString } from "../utils";
import {
    Token,
    TokenAnd,
    TokenCloseParenthesis,
    TokenComma,
    TokenComment,
    TokenEqual,
    TokenFalse,
    TokenIdentifier,
    TokenIs,
    TokenLike,
    TokenNot,
    TokenNotEqual,
    TokenNull,
    TokenOpenParenthesis,
    TokenOr,
    TokenSemiColon,
    TokenSet,
    TokenString,
    TokenTrue,
    TokenUpdate,
    TokenWhere,
} from "./token";

const ExactMatchTokens = [
    TokenUpdate,
    TokenSet,
    TokenWhere,
    TokenSemiColon,
    TokenComma,
    TokenOpenParenthesis,
    TokenCloseParenthesis,
    TokenNot,
    TokenEqual,
    TokenNotEqual,
    TokenLike,
    TokenIs,
    TokenAnd,
    TokenOr,
    TokenNull,
    TokenTrue,
    TokenFalse,
];
const RegexMatchTokens = [TokenIdentifier, TokenString, TokenComment];

export default class Lexer {
    input: string;

    constructor(input: string) {
        this.input = input;
    }

    scan(): Token[] {
        const result: Token[] = [];
        let token = this.next();
        while (token != null) {
            result.push(token);
            token = this.next();
        }
        return result;
    }

    next(): Token | null {
        if (this.input === "") {
            return null;
        }
        let result = this.matchExact();
        if (result === null) {
            result = this.matchRegex();
            if (result === null) {
                throw new Error(`Invalid syntax: ${trunkString(this.input, 20)}`);
            }
        }
        this.input = this.input.slice(result.shiftLen).trimStart();
        return result.token;
    }

    private matchExact(): { token: Token; shiftLen: number } | null {
        for (const TokenClass of ExactMatchTokens) {
            const len = TokenClass.value.length;
            if (this.input.slice(0, len).toUpperCase() === TokenClass.value) {
                return {
                    token: new TokenClass(),
                    shiftLen: len,
                };
            }
        }
        return null;
    }

    private matchRegex(): { token: Token; shiftLen: number } | null {
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
