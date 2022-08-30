import { Agg, SQSSVisitor } from "../visitor";
import { AndExpression, EqualExpression, FieldSelector, FuncCallExpression, IsExpression, JoinClause, LikeExpression, OrExpression, SqssNode, SqssStyleSheet, StyleAssignment, UpdateStatement } from "./ast";
declare type SAAgg<N> = Agg<N, SqssNode, void>;
export declare type SAContext = {
    joinTableAliases?: string[];
};
export default class SemanticAnalyzer implements SQSSVisitor<void, SAContext> {
    postVisitSqssStyleSheet(node: SqssStyleSheet, context: SAContext, data: SAAgg<SqssStyleSheet>): void;
    postVisitUpdateStatement(node: UpdateStatement, context: SAContext, data: SAAgg<UpdateStatement>): void;
    postVisitJoinClause(node: JoinClause, context: SAContext, data: SAAgg<JoinClause>): void;
    postVisitStyleAssignment(node: StyleAssignment, context: SAContext, data: SAAgg<StyleAssignment>): void;
    postVisitAndExpression(node: AndExpression, context: SAContext, data: SAAgg<AndExpression>): void;
    postVisitOrExpression(node: OrExpression, context: SAContext, data: SAAgg<OrExpression>): void;
    postVisitEqualExpression(node: EqualExpression, context: SAContext, data: SAAgg<EqualExpression>): void;
    postVisitLikeExpression(node: LikeExpression, context: SAContext, data: SAAgg<LikeExpression>): void;
    postVisitIsExpression(node: IsExpression, context: SAContext, data: SAAgg<IsExpression>): void;
    postVisitFieldSelector(node: FieldSelector, context: SAContext, data: SAAgg<FieldSelector>): void;
    private static validateIdentifier;
    postVisitFuncCallExpression(node: FuncCallExpression, context: SAContext, data: SAAgg<FuncCallExpression>): void;
}
export {};
