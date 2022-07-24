import { trim } from "./utils";

// Keywords
export class TokenUpdate {
    static readonly value = "UPDATE";

    toString() {
        return TokenUpdate.value;
    }
}

export class TokenSet {
    static readonly value = "SET";

    toString() {
        return TokenSet.value;
    }
}

export class TokenWhere {
    static readonly value = "WHERE";

    toString() {
        return TokenWhere.value;
    }
}

export class TokenIs {
    static readonly value = "IS";

    toString() {
        return TokenIs.value;
    }
}

export class TokenNot {
    static readonly value = "NOT";

    toString() {
        return TokenNot.value;
    }
}

export class TokenLike {
    static readonly value = "LIKE";

    toString() {
        return TokenLike.value;
    }
}

// Special char
export class TokenSemiColon {
    static readonly value = ";";

    toString() {
        return TokenSemiColon.value;
    }
}

export class TokenComma {
    static readonly value = ",";

    toString() {
        return TokenComma.value;
    }
}

// Operator

export class TokenEqual {
    static readonly value = "=";

    toString() {
        return TokenEqual.value;
    }
}

// Values
export class TokenIdentifier {
    static readonly regex = /^("[\w-.:[\]]+")|^([\w.]+)/;
    readonly raw: string;
    readonly value: string;

    constructor(value: string) {
        this.raw = value;
        this.value = trim(value, '"').trim();
    }

    toString() {
        return this.value;
    }
}

export class TokenString {
    static readonly regex = /^('')|^('.*[^\\]')/;
    readonly raw: string;
    readonly value: string;

    constructor(value: string) {
        this.raw = value;
        this.value = trim(value, "'").trim();
    }

    toString() {
        return this.value;
    }
}

export class TokenNull {
    static readonly value = "NULL";

    toString() {
        return TokenNull.value;
    }
}

export class TokenTrue {
    static readonly value = "TRUE";

    toString() {
        return TokenTrue.value;
    }
}

export class TokenFalse {
    static readonly value = "FALSE";

    toString() {
        return TokenFalse.value;
    }
}

export type TokenKeyword = TokenUpdate | TokenSet | TokenWhere | TokenIs | TokenNot | TokenLike;
export type TokenSpecialChar = TokenSemiColon | TokenComma;
export type TokenOperator = TokenEqual;
export type TokenValue = TokenString | TokenTrue | TokenFalse;
export type Token = TokenKeyword | TokenSpecialChar | TokenOperator | TokenIdentifier | TokenValue;
export type TokenClass = { new (...args: any[]): Token };
