import {trim, AnyCase} from "./utils";

// Keywords
class TokenUpdate {
    static readonly value = "UPDATE"

    toString() {
        return TokenUpdate.value;
    }
}

class TokenSet {
    static readonly value = "SET"

    toString() {
        return TokenSet.value;
    }
}

class TokenWhere {
    static readonly value = "WHERE"

    toString() {
        return TokenWhere.value;
    }
}

// Operators
class TokenSemiColon {
    static readonly value = ";"

    toString() {
        return TokenSemiColon.value;
    }
}

class TokenComma {
    static readonly value = ","

    toString() {
        return TokenComma.value;
    }
}

class TokenEqual {
    static readonly value = "="

    toString() {
        return TokenEqual.value;
    }
}

// Values
class TokenIdentifier {
    static readonly regex = /^("[\w-.:[\]]+")|^([\w.]+)/
    readonly raw: string
    readonly value: string

    constructor(value: string) {
        this.raw = value;
        this.value = trim(value, '"').trim();
    }

    toString() {
        return this.value
    }
}

class TokenString {
    static readonly regex = /^('')|^('.*[^\\]')/
    readonly raw: string
    readonly value: string

    constructor(value: string) {
        this.raw = value;
        this.value = trim(value, "'").trim();
    }

    toString() {
        return this.value
    }
}

class TokenBoolean {
    static readonly regex = /^(true)|(false)/i
    readonly raw: AnyCase<"true" | "false">;
    readonly value: boolean;

    constructor(value: AnyCase<"true" | "false">) {
        this.raw = value;
        this.value = value.toLocaleLowerCase() === "true";
    }

    toString() {
        return this.value
    }
}

type Token =
    TokenUpdate
    | TokenSet
    | TokenWhere
    | TokenSemiColon
    | TokenComma
    | TokenEqual
    | TokenIdentifier
    | TokenString
    | TokenBoolean;

const ExactMatchTokens = [TokenUpdate, TokenSet, TokenWhere, TokenSemiColon, TokenComma, TokenEqual];
const RegexMatchTokens = [TokenIdentifier, TokenString, TokenBoolean];

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
        return result
    }

    next(): Token | null {
        if (this.input === "") {
            return null
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

    private matchExact(): { token: Token, shiftLen: number } | null {
        for (const TokenClass of ExactMatchTokens) {
            const len = TokenClass.value.length;
            if (this.input.slice(0, len).toUpperCase() === TokenClass.value) {
                return {
                    token: new TokenClass(),
                    shiftLen: len
                }
            }
        }
        return null;
    }

    private matchRegex(): { token: Token, shiftLen: number } | null {
        for (const TokenClass of RegexMatchTokens) {
            const match = this.input.match(TokenClass.regex);
            if (match !== null) {
                return {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    token: new TokenClass(match[0]),
                    shiftLen: match[0].length,
                }
            }
        }
        return null;
    }
}

export default Lexer;
