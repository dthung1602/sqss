/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    AndExpression,
    ComparisonExpression,
    EqualExpression,
    Expression,
    FuncCallExpression,
    IsExpression,
    LikeExpression,
    OrExpression,
    SqssNode,
    SqssStyleSheet,
    StyleAssignment,
    UpdateStatement,
} from "../sqss/ast";
import { cartesian, isBool, isPseudoClassSelector, isPseudoElementSelector } from "../utils";
import { Agg, SQSSVisitor } from "../visitor";

type ReplaceNode = SqssNode | null;
type FCAgg<N> = Agg<N, SqssNode, ReplaceNode>;

export default class FlattenExpression implements SQSSVisitor<ReplaceNode, void> {
    postVisitSqssStyleSheet(node: SqssStyleSheet, context: void, data: FCAgg<SqssStyleSheet>): null {
        return null;
    }

    postVisitUpdateStatement(node: UpdateStatement, context: void, data: FCAgg<UpdateStatement>): null {
        if (data.where != null) {
            node.where = data.where;
        }
        return null;
    }

    postVisitStyleAssignment(node: StyleAssignment, context: void, data: FCAgg<StyleAssignment>): null {
        return null;
    }

    postVisitAndExpression(node: AndExpression, context: void, data: FCAgg<AndExpression>): ReplaceNode {
        this.replaceExpression(node, data);
        this.flatten(node, AndExpression);
        return this.distribute(node);
    }

    postVisitOrExpression(node: OrExpression, context: void, data: FCAgg<OrExpression>): ReplaceNode {
        this.replaceExpression(node, data);
        this.flatten(node, OrExpression);
        return null;
    }

    private replaceExpression<C extends OrExpression | AndExpression>(node: C, data: FCAgg<C>): null {
        if (Array.isArray(data.expressions)) {
            data.expressions.forEach((newNode, i) => {
                if (newNode instanceof Expression) {
                    node.expressions[i] = newNode;
                }
            });
        }
        return null;
    }

    private flatten<C extends OrExpression | AndExpression>(node: C, expressionClass: { new ([...args]: any): C }) {
        let newExpressions: typeof node.expressions = [];
        node.expressions.forEach((subExpression) => {
            if (subExpression instanceof expressionClass) {
                newExpressions = newExpressions.concat(subExpression.expressions);
            } else {
                newExpressions.push(subExpression);
            }
        });
        node.expressions = newExpressions;
    }

    private distribute(node: AndExpression): ReplaceNode {
        const comparisonExpressions = node.expressions.filter((c) => c instanceof ComparisonExpression);
        if (comparisonExpressions.length === node.expressions.length) {
            return null;
        }
        const orExpressions: OrExpression[] = node.expressions.filter(
            (c) => c instanceof OrExpression,
        ) as OrExpression[];
        const products = cartesian(...orExpressions.map((c) => c.expressions));
        return new OrExpression(products.map((cons) => new AndExpression([...comparisonExpressions, ...cons])));
    }

    postVisitEqualExpression(node: EqualExpression, context: void, data: FCAgg<EqualExpression>): null {
        return null;
    }

    postVisitLikeExpression(node: LikeExpression, context: void, data: FCAgg<LikeExpression>): null {
        return null;
    }

    postVisitIsExpression(node: IsExpression, context: void, data: FCAgg<IsExpression>): null {
        return null;
    }

    postVisitFuncCallExpression(node: FuncCallExpression, context: void, data: FCAgg<FuncCallExpression>): null {
        return null;
    }
}
