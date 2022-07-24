import TokenStream from "./token-stream";
import { Root, StyleStatement, UpdateStatement, Value, WhereStatement } from "./ast";
import {
    TokenComma,
    TokenEqual,
    TokenFalse,
    TokenIdentifier,
    TokenNull,
    TokenSet,
    TokenString,
    TokenTrue,
    TokenUpdate,
} from "./token";

export default class Parser {
    constructor(public stream: TokenStream) {}

    parse(): Root {
        return this.parseUpdateStatement();
    }

    private parseUpdateStatement(): Root {
        this.stream.expectedNext(TokenUpdate);
        const table = this.stream.expectedNext(TokenIdentifier) as TokenIdentifier;
        this.stream.expectedNext(TokenSet);
        const styleStatements = this.parseStyleStatements();
        const whereStatements = this.parseWhereStatements();
        return new Root(new UpdateStatement(table.value, styleStatements, whereStatements));
    }

    private parseStyleStatements(): StyleStatement[] {
        const statements: StyleStatement[] = [];
        // eslint-disable-next-line no-constant-condition
        while (true) {
            statements.push(this.parseStyleStatement());
            if (!(this.stream.next() instanceof TokenComma)) {
                this.stream.back();
                break;
            }
        }
        return statements;
    }

    private parseStyleStatement(): StyleStatement {
        const field = this.stream.expectedNext(TokenIdentifier) as TokenIdentifier;
        this.stream.expectedNext(TokenEqual);
        const value = this.parseValue();
        return new StyleStatement(field.value, value);
    }

    private parseValue(): Value {
        const token = this.stream.next();
        if (token instanceof TokenString) {
            return token.value;
        }
        if (token instanceof TokenTrue) {
            return true;
        }
        if (token instanceof TokenFalse) {
            return false;
        }
        if (token instanceof TokenNull) {
            return null;
        }
        throw new Error(`Unexpected token ${token}`);
    }

    private parseWhereStatements(): WhereStatement {
        const token = this.stream.next();
        if (token === null) {
            return new WhereStatement();
        }
        const selector = this.stream.expectedNext(TokenIdentifier) as TokenIdentifier;
        this.stream.expectedNext(TokenEqual);
        const value = this.stream.expectedNext(TokenString) as TokenString;
        return new WhereStatement(selector.value, value.value);
    }
}
