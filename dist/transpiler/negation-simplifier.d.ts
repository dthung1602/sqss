import { AndExpression, EqualExpression, FieldSelector, FuncCallExpression, IsExpression, JoinClause, LikeExpression, OrExpression, SqssNode, SqssStyleSheet, StyleAssignment, UpdateStatement } from "../sqss/ast";
import { Agg, SQSSVisitor } from "../visitor";
declare type ReplaceNode = SqssNode | null;
declare type NSAgg<N> = Agg<N, SqssNode, ReplaceNode>;
export default class NegationSimplifier implements SQSSVisitor<ReplaceNode, void> {
    postVisitSqssStyleSheet(node: SqssStyleSheet, context: void, data: NSAgg<SqssStyleSheet>): null;
    postVisitUpdateStatement(node: UpdateStatement, context: void, data: NSAgg<UpdateStatement>): null;
    postVisitJoinClause(node: JoinClause, context: void, data: NSAgg<JoinClause>): null;
    postVisitStyleAssignment(node: StyleAssignment, context: void, data: NSAgg<StyleAssignment>): null;
    postVisitAndExpression(node: AndExpression, context: void, data: NSAgg<AndExpression>): null;
    postVisitOrExpression(node: OrExpression, context: void, data: NSAgg<OrExpression>): null;
    private replaceExpression;
    postVisitEqualExpression(node: EqualExpression, context: void, data: NSAgg<EqualExpression>): ReplaceNode;
    postVisitLikeExpression(node: LikeExpression, context: void, data: NSAgg<LikeExpression>): null;
    postVisitIsExpression(node: IsExpression, context: void, data: NSAgg<IsExpression>): ReplaceNode;
    postVisitFuncCallExpression(node: FuncCallExpression, context: void, data: NSAgg<FuncCallExpression>): null;
    postVisitFieldSelector(node: FieldSelector, context: void, data: NSAgg<FieldSelector>): null;
}
export {};
