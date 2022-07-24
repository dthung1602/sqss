import { trim } from "./utils";

// Keywords
class TokenUpdate {
    static readonly value = "UPDATE";

    toString() {
        return TokenUpdate.value;
    }
}

class TokenSet {
    static readonly value = "SET";

    toString() {
        return TokenSet.value;
    }
}

class TokenWhere {
    static readonly value = "WHERE";

    toString() {
        return TokenWhere.value;
    }
}

class TokenIs {
    static readonly value = "IS";

    toString() {
        return TokenIs.value;
    }
}

class TokenNot {
    static readonly value = "NOT";

    toString() {
        return TokenNot.value;
    }
}

class TokenLike {
    static readonly value = "LIKE";

    toString() {
        return TokenLike.value;
    }
}

// Special char
class TokenSemiColon {
    static readonly value = ";";

    toString() {
        return TokenSemiColon.value;
    }
}

class TokenComma {
    static readonly value = ",";

    toString() {
        return TokenComma.value;
    }
}

// Operator

class TokenEqual {
    static readonly value = "=";

    toString() {
        return TokenEqual.value;
    }
}

// Values
class TokenIdentifier {
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

class TokenString {
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

class TokenNull {
    static readonly value = "NULL";

    toString() {
        return TokenNull.value;
    }
}

class TokenTrue {
    static readonly value = "TRUE";

    toString() {
        return TokenTrue.value;
    }
}

class TokenFalse {
    static readonly value = "FALSE";

    toString() {
        return TokenFalse.value;
    }
}

type TokenKeyword = TokenUpdate | TokenSet | TokenWhere | TokenIs | TokenNot | TokenLike;
type TokenSpecialChar = TokenSemiColon | TokenComma;
type TokenOperator = TokenEqual;
type TokenValue = TokenIdentifier | TokenString | TokenTrue | TokenFalse;
type Token = TokenKeyword | TokenSpecialChar | TokenOperator | TokenValue;

const ExactMatchTokens = [
    TokenUpdate,
    TokenSet,
    TokenWhere,
    TokenIs,
    TokenNot,
    TokenLike,
    TokenSemiColon,
    TokenComma,
    TokenEqual,
    TokenNull,
    TokenTrue,
    TokenFalse,
];
const RegexMatchTokens = [TokenIdentifier, TokenString];

class Lexer {
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
                throw new Error("Invalid syntax");
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

export default Lexer;
