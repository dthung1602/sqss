import Lexer from "./lexer";
import { Token, TokenClass } from "./token";
export default class TokenStream {
    private readonly tokens;
    private pos;
    constructor(lexer: Lexer);
    curr(): Token | undefined;
    peek(): Token | undefined;
    next(): Token | undefined;
    back(): Token | undefined;
    expectedNext(tokenClass: TokenClass): Token;
    hasEnded(): boolean;
    snapShot(): number;
    restoreSnapShot(snapshot: number): void;
}
