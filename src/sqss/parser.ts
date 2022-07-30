import {
    AndExpression,
    ComparisonExpression,
    EqualExpression,
    Expression,
    FuncCallExpression,
    IsExpression,
    LikeExpression,
    OrExpression,
    SqssStyleSheet,
    StyleAssignment,
    UpdateStatement,
} from "./ast";
import {
    Token,
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
    TokenNumber,
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

type FuncArg = string | boolean | number | null;

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
        const expression = this.parseWhereClause();
        this.stream.expectedNext(TokenSemiColon);
        return new UpdateStatement(table.value, styleAssignments, expression);
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

    private parseWhereClause(): Expression | null {
        const token = this.stream.next();
        if (token instanceof TokenWhere) {
            return this.parseExpression();
        }
        this.stream.back();
        return null;
    }

    private parseExpression(): Expression {
        // AND operator has higher precedence than OR
        let nextToken;
        const expressions: Expression[] = [];
        do {
            expressions.push(this.parseAndComparisonExpression());
            nextToken = this.stream.next();
        } while (nextToken instanceof TokenOr);
        this.stream.back();

        if (expressions.length === 1) {
            return expressions[0];
        }
        return new OrExpression(expressions);
    }

    private parseAndComparisonExpression(): Expression {
        const expressions: Expression[] = [];
        let nextToken;
        do {
            expressions.push(this.parseComparisonOrCompoundExpression());
            nextToken = this.stream.next();
        } while (nextToken instanceof TokenAnd);
        this.stream.back();

        if (expressions.length === 1) {
            return expressions[0];
        }
        return new AndExpression(expressions);
    }

    private parseComparisonOrCompoundExpression(): ComparisonExpression | Expression {
        const nextToken = this.stream.peek();
        if (nextToken instanceof TokenOpenParenthesis) {
            this.stream.next();
            const expression = this.parseExpression();
            this.stream.expectedNext(TokenCloseParenthesis);
            return expression;
        }
        return this.parseComparisonExpression();
    }

    private parseComparisonExpression(): ComparisonExpression {
        for (const parseFunc of [this.parseEqualExpression, this.parseLikeExpression, this.parseIsExpression]) {
            const snapshot = this.stream.snapShot();
            try {
                return parseFunc.bind(this)();
            } catch (e) {
                this.stream.restoreSnapShot(snapshot);
            }
        }
        throw new Error("Cannot parse expression");
    }

    private parseEqualExpression(): EqualExpression {
        const selector = this.parseComparisonExpressionLeftHandSide();
        const operator = this.stream.next();
        let negate = false;
        if (operator instanceof TokenNotEqual) {
            negate = true;
        } else if (!(operator instanceof TokenEqual)) {
            throw new Error(`Expecting = or !=, got ${operator}`);
        }
        const value = this.parseValue();
        return new EqualExpression(selector, negate, value);
    }

    private parseLikeExpression(): LikeExpression {
        const selector = this.parseComparisonExpressionLeftHandSide();
        const negate = this.parseNot();
        this.stream.expectedNext(TokenLike);
        const value = this.stream.expectedNext(TokenString) as TokenString;
        return new LikeExpression(selector, negate, value.value);
    }

    private parseIsExpression(): IsExpression {
        const selector = this.parseComparisonExpressionLeftHandSide();
        this.stream.expectedNext(TokenIs);
        const negate = this.parseNot();
        const value = this.parseNonStringValue();
        return new IsExpression(selector, negate, value);
    }

    private parseComparisonExpressionLeftHandSide(): string | FuncCallExpression {
        const snapshot = this.stream.snapShot();
        try {
            return this.parseFuncCallExpression();
        } catch (e) {
            this.stream.restoreSnapShot(snapshot);
            const selector = this.stream.expectedNext(TokenIdentifier) as TokenIdentifier;
            return selector.value;
        }
    }

    private parseFuncCallExpression(): FuncCallExpression {
        const name = this.stream.expectedNext(TokenIdentifier) as TokenIdentifier;
        this.stream.expectedNext(TokenOpenParenthesis);
        const args = this.parseFuncArgs();
        this.stream.expectedNext(TokenCloseParenthesis);
        return new FuncCallExpression(name.value, args);
    }

    private parseFuncArgs(): FuncArg[] {
        if (this.stream.peek() instanceof TokenCloseParenthesis) return [];
        const args = [this.parseFuncArg()];
        while (this.stream.peek() instanceof TokenComma) {
            this.stream.next();
            args.push(this.parseFuncArg());
        }
        return args;
    }

    private parseFuncArg(): FuncArg {
        const token = this.stream.next();
        if (token instanceof TokenString || token instanceof TokenIdentifier || token instanceof TokenNumber) {
            return token.value;
        }
        return this.parseNonStringValue(token);
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

    private parseNonStringValue(token?: Token): boolean | null {
        token = token || this.stream.next();
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
