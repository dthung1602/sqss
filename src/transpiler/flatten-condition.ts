/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    AndCondition,
    AtomicCondition,
    Condition,
    EqualCondition,
    IsCondition,
    LikeCondition,
    OrCondition,
    SqssNode,
    SqssStyleSheet,
    StyleAssignment,
    UpdateStatement,
} from "../sqss/ast";
import { cartesian, isBool, isPseudoClassSelector, isPseudoElementSelector } from "../utils";
import { Agg, SQSSVisitor } from "../visitor";

type ReplaceNode = SqssNode | null;
type FCAgg<N> = Agg<N, SqssNode, ReplaceNode>;

export default class FlattenCondition implements SQSSVisitor<ReplaceNode, void> {
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

    postVisitAndCondition(node: AndCondition, context: void, data: FCAgg<AndCondition>): ReplaceNode {
        this.replaceCondition(node, data);
        this.flatten(node, AndCondition);
        return this.distribute(node);
    }

    postVisitOrCondition(node: OrCondition, context: void, data: FCAgg<OrCondition>): ReplaceNode {
        this.replaceCondition(node, data);
        this.flatten(node, OrCondition);
        return null;
    }

    private replaceCondition<C extends OrCondition | AndCondition>(node: C, data: FCAgg<C>): null {
        if (Array.isArray(data.conditions)) {
            data.conditions.forEach((newNode, i) => {
                if (newNode instanceof Condition) {
                    node.conditions[i] = newNode;
                }
            });
        }
        return null;
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

    private distribute(node: AndCondition): ReplaceNode {
        const atomicConditions = node.conditions.filter((c) => c instanceof AtomicCondition);
        if (atomicConditions.length === node.conditions.length) {
            return null;
        }
        const orConditions: OrCondition[] = node.conditions.filter((c) => c instanceof OrCondition) as OrCondition[];
        const products = cartesian(...orConditions.map((c) => c.conditions));
        return new OrCondition(products.map((cons) => new AndCondition([...atomicConditions, ...cons])));
    }

    postVisitEqualCondition(node: EqualCondition, context: void, data: FCAgg<EqualCondition>): null {
        return null;
    }

    postVisitLikeCondition(node: LikeCondition, context: void, data: FCAgg<LikeCondition>): null {
        return null;
    }

    postVisitIsCondition(node: IsCondition, context: void, data: FCAgg<IsCondition>): null {
        return null;
    }
}
