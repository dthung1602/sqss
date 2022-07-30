import {
    AndCondition,
    AtomicCondition,
    Condition,
    EqualCondition,
    IsCondition,
    LikeCondition,
    OrCondition,
    SqssStyleSheet,
    StyleAssignment,
    UpdateStatement,
} from "./ast";
import {
    TokenAnd,
    TokenCloseParenthesis,
    TokenComma,
    TokenEqual,
    TokenFalse,
    TokenIdentifier,
    TokenIs,
    TokenLike,
    TokenNot,
    TokenNotEqual,
    TokenNull,
    TokenOpenParenthesis,
    TokenOr,
    TokenSemiColon,
    TokenSet,
    TokenString,
    TokenTrue,
    TokenUpdate,
    TokenWhere,
} from "./token";
import TokenStream from "./token-stream";

export default class Parser {
    constructor(public stream: TokenStream) {}

    parse(): SqssStyleSheet {
        const styleSheet = new SqssStyleSheet();
        while (!this.stream.hasEnded()) {
            const update = this.parseUpdateStatement();
            styleSheet.updates.push(update);
        }
        return styleSheet;
    }

    private parseUpdateStatement(): UpdateStatement {
        this.stream.expectedNext(TokenUpdate);
        const table = this.stream.expectedNext(TokenIdentifier) as TokenIdentifier;
        this.stream.expectedNext(TokenSet);
        const styleAssignments = this.parseStyleAssignments();
        const condition = this.parseWhereCondition();
        this.stream.expectedNext(TokenSemiColon);
        return new UpdateStatement(table.value, styleAssignments, condition);
    }

    private parseStyleAssignments(): StyleAssignment[] {
        const assignments: StyleAssignment[] = [];
        // eslint-disable-next-line no-constant-condition
        while (true) {
            assignments.push(this.parseStyleAssignment());
            if (!(this.stream.next() instanceof TokenComma)) {
                this.stream.back();
                break;
            }
        }
        return assignments;
    }

    private parseStyleAssignment(): StyleAssignment {
        const property = this.stream.expectedNext(TokenIdentifier) as TokenIdentifier;
        this.stream.expectedNext(TokenEqual);
        const value = this.stream.expectedNext(TokenString) as TokenString;
        return new StyleAssignment(property.value, value.value);
    }

    private parseWhereCondition(): Condition | null {
        const token = this.stream.next();
        if (token instanceof TokenWhere) {
            return this.parseCondition();
        }
        this.stream.back();
        return null;
    }

    private parseCondition(): Condition {
        // AND operator has higher precedence than OR
        let nextToken;
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

    private parseAndAtomicCondition(): Condition {
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
        for (const parseFunc of [this.parseEqualCondition, this.parseLikeCondition, this.parseIsCondition]) {
            const snapshot = this.stream.snapShot();
            try {
                return parseFunc.bind(this)();
            } catch (e) {
                this.stream.restoreSnapShot(snapshot);
            }
        }
        throw new Error("Cannot parse condition");
    }

    private parseEqualCondition(): EqualCondition {
        const selector = this.stream.expectedNext(TokenIdentifier) as TokenIdentifier;
        const operator = this.stream.next();
        let negate = false;
        if (operator instanceof TokenNotEqual) {
            negate = true;
        } else if (!(operator instanceof TokenEqual)) {
            throw new Error(`Expecting = or !=, got ${operator}`);
        }
        const value = this.parseValue();
        return new EqualCondition(selector.value, negate, value);
    }

    private parseLikeCondition(): LikeCondition {
        const selector = this.stream.expectedNext(TokenIdentifier) as TokenIdentifier;
        const negate = this.parseNot();
        this.stream.expectedNext(TokenLike);
        const value = this.stream.expectedNext(TokenString) as TokenString;
        return new LikeCondition(selector.value, negate, value.value);
    }

    private parseIsCondition(): IsCondition {
        const selector = this.stream.expectedNext(TokenIdentifier) as TokenIdentifier;
        this.stream.expectedNext(TokenIs);
        const negate = this.parseNot();
        const value = this.parseNonStringValue();
        return new IsCondition(selector.value, negate, value);
    }

    private parseNot(): boolean {
        const not = this.stream.peek() instanceof TokenNot;
        if (not) this.stream.next();
        return not;
    }

    private parseValue(): string | boolean | null {
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

    private parseNonStringValue(): boolean | null {
        const token = this.stream.next();
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
}
