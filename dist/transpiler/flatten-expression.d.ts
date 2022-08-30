import { AndExpression, EqualExpression, FieldSelector, FuncCallExpression, IsExpression, JoinClause, LikeExpression, OrExpression, SqssNode, SqssStyleSheet, StyleAssignment, UpdateStatement } from "../sqss/ast";
import { Agg, SQSSVisitor } from "../visitor";
declare type ReplaceNode = SqssNode | null;
declare type FCAgg<N> = Agg<N, SqssNode, ReplaceNode>;
export default class FlattenExpression implements SQSSVisitor<ReplaceNode, void> {
    postVisitSqssStyleSheet(node: SqssStyleSheet, context: void, data: FCAgg<SqssStyleSheet>): null;
    postVisitUpdateStatement(node: UpdateStatement, context: void, data: FCAgg<UpdateStatement>): null;
    postVisitJoinClause(node: JoinClause, context: void, data: FCAgg<JoinClause>): null;
    postVisitStyleAssignment(node: StyleAssignment, context: void, data: FCAgg<StyleAssignment>): null;
    postVisitAndExpression(node: AndExpression, context: void, data: FCAgg<AndExpression>): ReplaceNode;
    postVisitOrExpression(node: OrExpression, context: void, data: FCAgg<OrExpression>): ReplaceNode;
    private replaceExpression;
    private flatten;
    private distribute;
    postVisitEqualExpression(node: EqualExpression, context: void, data: FCAgg<EqualExpression>): null;
    postVisitLikeExpression(node: LikeExpression, context: void, data: FCAgg<LikeExpression>): null;
    postVisitIsExpression(node: IsExpression, context: void, data: FCAgg<IsExpression>): null;
    postVisitFuncCallExpression(node: FuncCallExpression, context: void, data: FCAgg<FuncCallExpression>): null;
    postVisitFieldSelector(node: FieldSelector, context: void, data: FCAgg<FieldSelector>): null;
}
export {};
