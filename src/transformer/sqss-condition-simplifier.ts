/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    AndCondition,
    Condition,
    EqualCondition,
    IsCondition,
    LikeCondition,
    OrCondition,
    SqssNode,
    SqssStyleSheet,
    StyleAssignment,
    UpdateStatement,
} from "../sql/ast";
import { isBool, isPseudoClassSelector, isPseudoElementSelector } from "../utils";
import { Agg, SQSSVisitor } from "../visitor";

type ReplaceNode = SqssNode | null;
type SAAgg<N> = Agg<N, SqssNode, ReplaceNode>;

export default class SqssConditionSimplifier implements SQSSVisitor<ReplaceNode, void> {
    postVisitSqssStyleSheet(node: SqssStyleSheet, context: void, data: SAAgg<SqssStyleSheet>): null {
        return null;
    }

    postVisitUpdateStatement(node: UpdateStatement, context: void, data: SAAgg<UpdateStatement>): null {
        if (data.where != null) {
            node.where = data.where;
        }
        return null;
    }

    postVisitStyleAssignment(node: StyleAssignment, context: void, data: SAAgg<StyleAssignment>): null {
        return null;
    }

    postVisitAndCondition(node: AndCondition, context: void, data: SAAgg<AndCondition>): null {
        return this.replaceCondition(node, data);
    }

    postVisitOrCondition(node: OrCondition, context: void, data: SAAgg<OrCondition>): null {
        return this.replaceCondition(node, data);
    }

    private replaceCondition<C extends OrCondition | AndCondition>(node: C, data: SAAgg<C>): null {
        if (Array.isArray(data.conditions)) {
            data.conditions.forEach((newNode, i) => {
                if (newNode instanceof Condition) {
                    node.conditions[i] = newNode;
                }
            });
        }
        return null;
    }

    postVisitEqualCondition(node: EqualCondition, context: void, data: SAAgg<EqualCondition>): ReplaceNode {
        if (node.negate && isBool(node.value)) {
            node.negate = false;
            node.value = !node.value;
        }
        return null;
    }

    postVisitLikeCondition(node: LikeCondition, context: void, data: SAAgg<LikeCondition>): null {
        return null;
    }

    postVisitIsCondition(node: IsCondition, context: void, data: SAAgg<IsCondition>): ReplaceNode {
        if (isPseudoClassSelector(node.selector) || isPseudoElementSelector(node.selector) || isBool(node.value)) {
            const value = node.negate ? !node.value : node.value;
            return new EqualCondition(node.selector, false, value);
        }
        return null;
    }
}
