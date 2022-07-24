import Lexer from "./lexer";
import { Token, TokenClass } from "./token";

export default class TokenStream {
    private readonly tokens: Token[];
    private pos: number;

    constructor(lexer: Lexer) {
        // TODO lazy scan
        this.tokens = lexer.scan();
        this.pos = -1;
    }

    curr(): Token | undefined {
        return this.tokens[this.pos];
    }

    peek(): Token | undefined {
        return this.tokens[this.pos + 1];
    }

    next(): Token | undefined {
        this.pos = Math.min(this.pos + 1, this.tokens.length);
        return this.curr();
    }

    back(): Token | undefined {
        this.pos = Math.max(this.pos - 1, -1);
        return this.curr();
    }

    expectedNext(tokenClass: TokenClass): Token {
        const token = this.next();
        if (token instanceof tokenClass) {
            return token;
        }
        throw Error(`Expecting ${tokenClass.name}, got ${this.curr()}`);
    }

    hasEnded(): boolean {
        return this.pos === this.tokens.length;
    }
}
