import TokenStream from "./token-stream";
import {
    AndCondition,
    AtomicCondition,
    Condition,
    OrCondition,
    Root,
    StyleStatement,
    UpdateStatement,
    Value,
    WhereStatement,
} from "./ast";
import {
    TokenComma,
    TokenEqual,
    TokenFalse,
    TokenIdentifier,
    TokenLike,
    TokenNot,
    TokenNull,
    TokenIs,
    TokenSet,
    TokenString,
    TokenTrue,
    TokenUpdate,
    TokenOpenParenthesis,
    TokenCloseParenthesis,
    TokenAnd,
    TokenOr,
    TokenSemiColon,
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
        this.stream.expectedNext(TokenSemiColon);
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
        throw new Error(`Expecting a value token, got ${token}`);
    }

    private parseWhereStatements(): WhereStatement {
        const token = this.stream.next();
        if (token === null) {
            return new WhereStatement(null);
        }
        return new WhereStatement(this.parseCondition());
    }

    private parseCondition(): Condition {
        let nextToken = this.stream.peek();
        if (nextToken instanceof TokenOpenParenthesis) {
            this.stream.next();
            const condition = this.parseCondition();
            this.stream.expectedNext(TokenCloseParenthesis);
            return condition;
        }

        const conditions: Condition[] = [];
        do {
            conditions.push(this.parseAndAtomicCondition());
            nextToken = this.stream.next();
        } while (nextToken instanceof TokenOr);
        this.stream.back();

        if (conditions.length === 1) {
            return conditions[0];
        }
        return new OrCondition(conditions);
    }

    private parseAndAtomicCondition(): AndCondition | AtomicCondition {
        const conditions: Condition[] = [];
        let nextToken;
        do {
            conditions.push(this.parseAtomicOrCompoundCondition());
            nextToken = this.stream.next();
        } while (nextToken instanceof TokenAnd);
        this.stream.back();

        if (conditions.length === 1) {
            return conditions[0];
        }
        return new AndCondition(conditions);
    }

    private parseAtomicOrCompoundCondition(): AtomicCondition | Condition {
        const nextToken = this.stream.peek();
        if (nextToken instanceof TokenOpenParenthesis) {
            this.stream.next();
            const condition = this.parseCondition();
            this.stream.expectedNext(TokenCloseParenthesis);
            return condition;
        }
        return this.parseAtomicCondition();
    }

    private parseAtomicCondition(): AtomicCondition {
        const selector = this.stream.expectedNext(TokenIdentifier) as TokenIdentifier;
        let negate = this.parseNot();
        const operator = this.parseOperator();
        if (!negate) {
            negate = this.parseNot();
        }
        const value = this.parseValue();

        return new AtomicCondition(selector.value, operator, negate, value);
    }

    private parseNot(): boolean {
        const not = this.stream.peek() instanceof TokenNot;
        if (not) this.stream.next();
        return not;
    }

    private parseOperator(): string {
        const token = this.stream.next();
        for (const cls of [TokenEqual, TokenLike, TokenIs]) {
            if (token instanceof cls) {
                return cls.value;
            }
        }
        throw new Error(`Expecting an operator, got ${token}`);
    }
}
