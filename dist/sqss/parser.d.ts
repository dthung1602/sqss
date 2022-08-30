import { SqssStyleSheet } from "./ast";
import TokenStream from "./token-stream";
export default class Parser {
    stream: TokenStream;
    constructor(stream: TokenStream);
    parse(): SqssStyleSheet;
    private parseUpdateStatement;
    private parseJoinClauses;
    private parseJoinClause;
    private parseStyleAssignments;
    private parseStyleAssignment;
    private parseWhereClause;
    private parseExpression;
    private parseAndComparisonExpression;
    private parseComparisonOrCompoundExpression;
    private parseComparisonExpression;
    private parseEqualExpression;
    private parseLikeExpression;
    private parseIsExpression;
    private parseComparisonExpressionLeftHandSide;
    private parseFieldSelector;
    private parseFuncCallExpression;
    private parseFuncArgs;
    private parseFuncArg;
    private parseNot;
    private parseValue;
    private parseNonStringValue;
}
