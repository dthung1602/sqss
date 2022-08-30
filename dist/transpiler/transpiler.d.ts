import { AJSelector, AtomicSelector, CSSNode, CSSStyleSheet, JoinSelector, NoOp, OrSelector, StyleDeclaration, StyleRule } from "../css/ast";
import { AndExpression, EqualExpression, FieldSelector, FuncCallExpression, IsExpression, JoinClause, LikeExpression, OrExpression, SqssNode, SqssStyleSheet, StyleAssignment, UpdateStatement } from "../sqss/ast";
import { Agg, SQSSVisitor } from "../visitor";
declare type TPAgg<N> = Agg<N, SqssNode, CSSNode>;
declare type JoinSelectorClass = {
    new (a: AJSelector, b: AJSelector): JoinSelector;
};
export declare type TPContext = {
    joinGraph?: {
        left: string;
        right: string;
        selectorClass: JoinSelectorClass;
    }[];
};
export default class Transpiler implements SQSSVisitor<CSSNode, TPContext> {
    postVisitSqssStyleSheet(node: SqssStyleSheet, context: TPContext, data: TPAgg<SqssStyleSheet>): CSSStyleSheet;
    postVisitUpdateStatement(node: UpdateStatement, context: TPContext, data: TPAgg<UpdateStatement>): StyleRule;
    postVisitJoinClause(node: JoinClause, context: TPContext, data: TPAgg<JoinClause>): NoOp;
    postVisitStyleAssignment(node: StyleAssignment, context: TPContext, data: TPAgg<StyleAssignment>): StyleDeclaration;
    postVisitAndExpression(node: AndExpression, context: TPContext, data: TPAgg<AndExpression>): AJSelector;
    private static getSelectorFromGroup;
    postVisitOrExpression(node: OrExpression, context: TPContext, data: TPAgg<OrExpression>): OrSelector;
    postVisitEqualExpression(node: EqualExpression, context: TPContext, data: TPAgg<EqualExpression>): AtomicSelector | NoOp;
    private static getSelectorForEqualExpression;
    postVisitLikeExpression(node: LikeExpression, context: TPContext, data: TPAgg<LikeExpression>): AtomicSelector;
    postVisitIsExpression(node: IsExpression, context: TPContext, data: TPAgg<IsExpression>): AtomicSelector;
    postVisitFieldSelector(node: FieldSelector, context: TPContext, data: TPAgg<FieldSelector>): NoOp;
    postVisitFuncCallExpression(node: FuncCallExpression, context: TPContext, data: TPAgg<FuncCallExpression>): CSSNode;
    private static buildJoinGraph;
    private static getTableName;
    private static verifyJoinGraph;
    private static getAttributeSelectorOperator;
}
export {};
