import { trim } from "../utils";

// Keywords

export class TokenUpdate {
    static readonly value = "UPDATE";
}

export class TokenSet {
    static readonly value = "SET";
}

export class TokenWhere {
    static readonly value = "WHERE";
}

export class TokenJoin {
    static readonly value = "JOIN";
}

export class TokenAs {
    static readonly value = "AS";
}

export class TokenOn {
    static readonly value = "ON";
}

// Special char

export class TokenSemiColon {
    static readonly value = ";";
}

export class TokenComma {
    static readonly value = ",";
}

export class TokenOpenParenthesis {
    static readonly value = "(";
}

export class TokenCloseParenthesis {
    static readonly value = ")";
}

// Operator

export class TokenNot {
    static readonly value = "NOT";
}

export class TokenEqual {
    static readonly value = "=";
}

export class TokenNotEqual {
    static readonly value = "!=";
}

export class TokenLike {
    static readonly value = "LIKE";
}

export class TokenIs {
    static readonly value = "IS";
}

export class TokenAnd {
    static readonly value = "AND";
}

export class TokenOr {
    static readonly value = "OR";
}

// Identifier

export class TokenIdentifier {
    static readonly regex = /^("[\w-.:[\]]+")|^([\w.]+)/;
    readonly raw: string;
    readonly value: string;

    constructor(value: string) {
        this.raw = value;
        this.value = trim(value, '"').trim();
    }
}

// Values

export class TokenString {
    static readonly regex = /^('')|^('.*?[^\\]')/;
    readonly raw: string;
    readonly value: string;

    constructor(value: string) {
        this.raw = value;
        this.value = trim(value, "'").trim();
    }
}

export class TokenNull {
    static readonly value = "NULL";
}

export class TokenTrue {
    static readonly value = "TRUE";
}

export class TokenFalse {
    static readonly value = "FALSE";
}

export class TokenNumber {
    static readonly regex = /^-?\d+(\.\d+)?/;
    readonly raw: string;
    readonly value: number;

    constructor(value: string) {
        this.raw = value;
        this.value = parseFloat(value);
    }
}

// Other

export class TokenComment {
    static readonly regex = /^--[^\n]*/;
    readonly raw: string;
    readonly value: string;

    constructor(value: string) {
        this.raw = value;
        this.value = value.slice(2);
    }
}

export type TokenKeyword = TokenUpdate | TokenSet | TokenWhere | TokenJoin | TokenAs | TokenOn;
export type TokenSpecialChar = TokenSemiColon | TokenComma | TokenOpenParenthesis | TokenCloseParenthesis;
export type TokenOperator = TokenEqual | TokenNotEqual | TokenIs | TokenNot | TokenLike | TokenAnd | TokenOr;
export type TokenValue = TokenString | TokenNull | TokenTrue | TokenFalse | TokenNumber;
export type Token = TokenKeyword | TokenSpecialChar | TokenOperator | TokenIdentifier | TokenValue | TokenComment;
export type TokenClass = { new (...args: any[]): Token };
