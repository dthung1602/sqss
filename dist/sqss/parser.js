"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_1 = require("./ast");
const token_1 = require("./token");
class Parser {
    constructor(stream) {
        this.stream = stream;
    }
    parse() {
        const styleSheet = new ast_1.SqssStyleSheet();
        while (!this.stream.hasEnded()) {
            const update = this.parseUpdateStatement();
            styleSheet.updates.push(update);
        }
        return styleSheet;
    }
    parseUpdateStatement() {
        this.stream.expectedNext(token_1.TokenUpdate);
        const table = this.stream.expectedNext(token_1.TokenIdentifier);
        const joins = this.parseJoinClauses();
        this.stream.expectedNext(token_1.TokenSet);
        const styleAssignments = this.parseStyleAssignments();
        const expression = this.parseWhereClause();
        this.stream.expectedNext(token_1.TokenSemiColon);
        return new ast_1.UpdateStatement(table.value, joins, styleAssignments, expression);
    }
    parseJoinClauses() {
        const joins = [];
        let nextToken = this.stream.peek();
        while (nextToken instanceof token_1.TokenJoin) {
            joins.push(this.parseJoinClause());
            nextToken = this.stream.peek();
        }
        return joins;
    }
    parseJoinClause() {
        this.stream.expectedNext(token_1.TokenJoin);
        const table = this.stream.expectedNext(token_1.TokenIdentifier);
        this.stream.expectedNext(token_1.TokenAs);
        const alias = this.stream.expectedNext(token_1.TokenIdentifier);
        this.stream.expectedNext(token_1.TokenOn);
        const expression = this.parseExpression();
        return new ast_1.JoinClause(table.value, alias.value, expression);
    }
    parseStyleAssignments() {
        const assignments = [];
        // eslint-disable-next-line no-constant-condition
        while (true) {
            assignments.push(this.parseStyleAssignment());
            if (!(this.stream.next() instanceof token_1.TokenComma)) {
                this.stream.back();
                break;
            }
        }
        return assignments;
    }
    parseStyleAssignment() {
        const property = this.stream.expectedNext(token_1.TokenIdentifier);
        this.stream.expectedNext(token_1.TokenEqual);
        const value = this.stream.expectedNext(token_1.TokenString);
        return new ast_1.StyleAssignment(property.value, value.value);
    }
    parseWhereClause() {
        const token = this.stream.next();
        if (token instanceof token_1.TokenWhere) {
            return this.parseExpression();
        }
        this.stream.back();
        return null;
    }
    parseExpression() {
        // AND operator has higher precedence than OR
        let nextToken;
        const expressions = [];
        do {
            expressions.push(this.parseAndComparisonExpression());
            nextToken = this.stream.next();
        } while (nextToken instanceof token_1.TokenOr);
        this.stream.back();
        if (expressions.length === 1) {
            return expressions[0];
        }
        return new ast_1.OrExpression(expressions);
    }
    parseAndComparisonExpression() {
        const expressions = [];
        let nextToken;
        do {
            expressions.push(this.parseComparisonOrCompoundExpression());
            nextToken = this.stream.next();
        } while (nextToken instanceof token_1.TokenAnd);
        this.stream.back();
        if (expressions.length === 1) {
            return expressions[0];
        }
        return new ast_1.AndExpression(expressions);
    }
    parseComparisonOrCompoundExpression() {
        const nextToken = this.stream.peek();
        if (nextToken instanceof token_1.TokenOpenParenthesis) {
            this.stream.next();
            const expression = this.parseExpression();
            this.stream.expectedNext(token_1.TokenCloseParenthesis);
            return expression;
        }
        return this.parseComparisonExpression();
    }
    parseComparisonExpression() {
        for (const parseFunc of [this.parseEqualExpression, this.parseLikeExpression, this.parseIsExpression]) {
            const snapshot = this.stream.snapShot();
            try {
                return parseFunc.bind(this)();
            }
            catch (e) {
                this.stream.restoreSnapShot(snapshot);
            }
        }
        throw new Error("Cannot parse expression");
    }
    parseEqualExpression() {
        const selector = this.parseComparisonExpressionLeftHandSide();
        const operator = this.stream.next();
        let negate = false;
        if (operator instanceof token_1.TokenNotEqual) {
            negate = true;
        }
        else if (!(operator instanceof token_1.TokenEqual)) {
            throw new Error(`Expecting = or !=, got ${operator}`);
        }
        const value = this.parseValue();
        return new ast_1.EqualExpression(selector, negate, value);
    }
    parseLikeExpression() {
        const selector = this.parseComparisonExpressionLeftHandSide();
        const negate = this.parseNot();
        this.stream.expectedNext(token_1.TokenLike);
        const value = this.stream.expectedNext(token_1.TokenString);
        return new ast_1.LikeExpression(selector, negate, value.value);
    }
    parseIsExpression() {
        const selector = this.parseComparisonExpressionLeftHandSide();
        this.stream.expectedNext(token_1.TokenIs);
        const negate = this.parseNot();
        const value = this.parseNonStringValue();
        return new ast_1.IsExpression(selector, negate, value);
    }
    parseComparisonExpressionLeftHandSide() {
        const snapshot = this.stream.snapShot();
        try {
            return this.parseFuncCallExpression();
        }
        catch (e) {
            this.stream.restoreSnapShot(snapshot);
            const selector = this.stream.expectedNext(token_1.TokenIdentifier);
            return this.parseFieldSelector(selector.value);
        }
    }
    parseFieldSelector(value) {
        const s = value.split(".");
        if (s.length === 2) {
            return new ast_1.FieldSelector(s[1], s[0]);
        }
        if (s.length === 1) {
            return new ast_1.FieldSelector(s[0]);
        }
        throw new Error(`Cannot parse field ${value}`);
    }
    parseFuncCallExpression() {
        const name = this.stream.expectedNext(token_1.TokenIdentifier);
        this.stream.expectedNext(token_1.TokenOpenParenthesis);
        const args = this.parseFuncArgs();
        this.stream.expectedNext(token_1.TokenCloseParenthesis);
        return new ast_1.FuncCallExpression(name.value, args);
    }
    parseFuncArgs() {
        if (this.stream.peek() instanceof token_1.TokenCloseParenthesis)
            return [];
        const args = [this.parseFuncArg()];
        while (this.stream.peek() instanceof token_1.TokenComma) {
            this.stream.next();
            args.push(this.parseFuncArg());
        }
        return args;
    }
    parseFuncArg() {
        const token = this.stream.next();
        if (token instanceof token_1.TokenString || token instanceof token_1.TokenIdentifier || token instanceof token_1.TokenNumber) {
            return token.value;
        }
        return this.parseNonStringValue(token);
    }
    parseNot() {
        const not = this.stream.peek() instanceof token_1.TokenNot;
        if (not)
            this.stream.next();
        return not;
    }
    parseValue() {
        const token = this.stream.next();
        if (token instanceof token_1.TokenString) {
            return token.value;
        }
        if (token instanceof token_1.TokenTrue) {
            return true;
        }
        if (token instanceof token_1.TokenFalse) {
            return false;
        }
        if (token instanceof token_1.TokenNull) {
            return null;
        }
        throw new Error(`Expecting a value token, got ${token}`);
    }
    parseNonStringValue(token) {
        token = token || this.stream.next();
        if (token instanceof token_1.TokenTrue) {
            return true;
        }
        if (token instanceof token_1.TokenFalse) {
            return false;
        }
        if (token instanceof token_1.TokenNull) {
            return null;
        }
        throw new Error(`Expecting a value token, got ${token}`);
    }
}
exports.default = Parser;
//# sourceMappingURL=parser.js.map