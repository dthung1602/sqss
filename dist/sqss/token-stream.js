"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const inspect_1 = require("../inspect");
const token_1 = require("./token");
class TokenStream {
    constructor(lexer) {
        // TODO lazy scan, handle comment properly
        this.tokens = lexer.scan();
        this.tokens = this.tokens.filter((tok) => !(tok instanceof token_1.TokenComment));
        this.pos = -1;
    }
    curr() {
        return this.tokens[this.pos];
    }
    peek() {
        return this.tokens[this.pos + 1];
    }
    next() {
        this.pos = Math.min(this.pos + 1, this.tokens.length);
        return this.curr();
    }
    back() {
        this.pos = Math.max(this.pos - 1, -1);
        return this.curr();
    }
    expectedNext(tokenClass) {
        const token = this.next();
        if (token instanceof tokenClass) {
            return token;
        }
        throw Error(`Expecting ${tokenClass.name}, got ${(0, inspect_1.default)(this.curr())}`);
    }
    hasEnded() {
        return this.pos === this.tokens.length - 1;
    }
    snapShot() {
        return this.pos;
    }
    restoreSnapShot(snapshot) {
        this.pos = snapshot;
    }
}
exports.default = TokenStream;
//# sourceMappingURL=token-stream.js.map