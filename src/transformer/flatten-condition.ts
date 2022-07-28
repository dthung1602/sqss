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

type FCAgg<N> = Agg<N, SqssNode, void>;

export default class FlattenCondition implements SQSSVisitor<void, void> {
    postVisitSqssStyleSheet(node: SqssStyleSheet, context: void, data: FCAgg<SqssStyleSheet>) {}

    postVisitUpdateStatement(node: UpdateStatement, context: void, data: FCAgg<UpdateStatement>) {}

    postVisitStyleAssignment(node: StyleAssignment, context: void, data: FCAgg<StyleAssignment>) {}

    postVisitAndCondition(node: AndCondition, context: void, data: FCAgg<AndCondition>) {
        return this.flatten(node, AndCondition);
    }

    postVisitOrCondition(node: OrCondition, context: void, data: FCAgg<OrCondition>) {
        return this.flatten(node, OrCondition);
    }

    private flatten<C extends OrCondition | AndCondition>(node: C, conditionClass: { new ([...args]: any): C }) {
        let newConditions: typeof node.conditions = [];
        node.conditions.forEach((subCondition) => {
            if (subCondition instanceof conditionClass) {
                newConditions = newConditions.concat(subCondition.conditions);
            } else {
                newConditions.push(subCondition);
            }
        });
        node.conditions = newConditions;
    }

    postVisitEqualCondition(node: EqualCondition, context: void, data: FCAgg<EqualCondition>) {}

    postVisitLikeCondition(node: LikeCondition, context: void, data: FCAgg<LikeCondition>) {}

    postVisitIsCondition(node: IsCondition, context: void, data: FCAgg<IsCondition>) {}
}
