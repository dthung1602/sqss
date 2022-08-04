/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import {
    AndExpression,
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
import { isBool, isPseudoClassSelector, isPseudoElementSelector, xor } from "../utils";
import { Agg, SQSSVisitor } from "../visitor";

type ReplaceNode = SqssNode | null;
type NSAgg<N> = Agg<N, SqssNode, ReplaceNode>;

export default class NegationSimplifier implements SQSSVisitor<ReplaceNode, void> {
    postVisitSqssStyleSheet(node: SqssStyleSheet, context: void, data: NSAgg<SqssStyleSheet>): null {
        return null;
    }

    postVisitUpdateStatement(node: UpdateStatement, context: void, data: NSAgg<UpdateStatement>): null {
        if (data.where != null) {
            node.where = data.where;
        }
        return null;
    }

    postVisitStyleAssignment(node: StyleAssignment, context: void, data: NSAgg<StyleAssignment>): null {
        return null;
    }

    postVisitAndExpression(node: AndExpression, context: void, data: NSAgg<AndExpression>): null {
        return this.replaceExpression(node, data);
    }

    postVisitOrExpression(node: OrExpression, context: void, data: NSAgg<OrExpression>): null {
        return this.replaceExpression(node, data);
    }

    private replaceExpression<C extends OrExpression | AndExpression>(node: C, data: NSAgg<C>): null {
        if (Array.isArray(data.expressions)) {
            data.expressions.forEach((newNode, i) => {
                if (newNode instanceof Expression) {
                    node.expressions[i] = newNode;
                }
            });
        }
        return null;
    }

    postVisitEqualExpression(node: EqualExpression, context: void, data: NSAgg<EqualExpression>): ReplaceNode {
        if (isBool(node.value)) {
            node.negate = !xor(node.negate, node.value as boolean);
            node.value = true;
        }
        return null;
    }

    postVisitLikeExpression(node: LikeExpression, context: void, data: NSAgg<LikeExpression>): null {
        return null;
    }

    postVisitIsExpression(node: IsExpression, context: void, data: NSAgg<IsExpression>): ReplaceNode {
        if (isBool(node.value)) {
            const value = node.negate ? !node.value : node.value;
            return new EqualExpression(node.selector, false, value);
        }
        return null;
    }

    postVisitFuncCallExpression(node: FuncCallExpression, context: void, data: NSAgg<FuncCallExpression>): null {
        return null;
    }
}
