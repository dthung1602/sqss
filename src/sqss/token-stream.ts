// @ts-ignore
import inspect from "../inspect";
import Lexer from "./lexer";
import { Token, TokenClass, TokenComment } from "./token";

export default class TokenStream {
    private readonly tokens: Token[];
    private pos: number;

    constructor(lexer: Lexer) {
        // TODO lazy scan, handle comment properly
        this.tokens = lexer.scan();
        this.tokens = this.tokens.filter((tok) => !(tok instanceof TokenComment));
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
        throw Error(`Expecting ${tokenClass.name}, got ${inspect(this.curr())}`);
    }

    hasEnded(): boolean {
        return this.pos === this.tokens.length - 1;
    }

    snapShot(): number {
        return this.pos;
    }

    restoreSnapShot(snapshot: number) {
        this.pos = snapshot;
    }
}
