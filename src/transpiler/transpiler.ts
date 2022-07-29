/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import {
    AllSelector,
    AndSelector,
    AtomicSelector,
    AttributeOperator,
    AttributeSelector,
    ClassSelector,
    CSSNode,
    CSSStyleSheet,
    ElementSelector,
    IdSelector,
    NotSelector,
    OrSelector,
    PseudoClassSelector,
    PseudoElementSelector,
    StyleDeclaration,
    StyleRule,
} from "../css/ast";
import {
    AndCondition,
    EqualCondition,
    IsCondition,
    LikeCondition,
    OrCondition,
    SqssNode,
    SqssStyleSheet,
    StyleAssignment,
    UpdateStatement,
} from "../sqss/ast";
import { isPseudoClassSelector, isPseudoElementSelector, trim, trimStart } from "../utils";
import { Agg, SQSSVisitor } from "../visitor";

type STCAgg<N> = Agg<N, SqssNode, CSSNode>;
type SimpleSelector = { new (...args: any[]): Exclude<AtomicSelector, AttributeSelector> };

export default class Transpiler implements SQSSVisitor<CSSNode, void> {
    postVisitSqssStyleSheet(node: SqssStyleSheet, context: void, data: STCAgg<SqssStyleSheet>): CSSStyleSheet {
        return new CSSStyleSheet(data.updates as StyleRule[]);
    }

    postVisitUpdateStatement(node: UpdateStatement, context: void, data: STCAgg<UpdateStatement>): StyleRule {
        const where = data.where ? data.where : new AllSelector();
        return new StyleRule(where, data.assignments as StyleDeclaration[]);
    }

    postVisitStyleAssignment(node: StyleAssignment, context: void, data: STCAgg<StyleAssignment>): StyleDeclaration {
        return new StyleDeclaration(node.property, node.value);
    }

    postVisitAndCondition(node: AndCondition, context: void, data: STCAgg<AndCondition>): AndSelector {
        return new AndSelector(data.conditions);
    }

    postVisitOrCondition(node: OrCondition, context: void, data: STCAgg<OrCondition>): OrSelector {
        return new OrSelector(data.conditions);
    }

    postVisitEqualCondition(node: EqualCondition, context: void, data: STCAgg<EqualCondition>): AtomicSelector {
        switch (node.selector) {
            case "element":
                return new ElementSelector(node.value as string);
            case "id":
                return new IdSelector(node.value as string);
            case "class":
                return new ClassSelector(node.value as string);
        }
        if (isPseudoElementSelector(node.selector)) {
            return new PseudoElementSelector(trimStart(node.selector, ":"), node.value as boolean);
        }
        if (isPseudoClassSelector(node.selector)) {
            return new PseudoClassSelector(trimStart(node.selector, ":"), node.value as boolean);
        }
        throw new Error(`Unknown selector: ${node.selector}`);
    }

    postVisitLikeCondition(node: LikeCondition, context: void, data: STCAgg<LikeCondition>): AtomicSelector {
        const attrSelector = new AttributeSelector(
            node.selector.slice(1, node.selector.length - 1),
            Transpiler.getAttributeSelectorOperator(node.value),
            trim(node.value, "%"),
        );
        if (node.negate) {
            return new NotSelector(attrSelector);
        }
        return attrSelector;
    }

    postVisitIsCondition(node: IsCondition, context: void, data: STCAgg<IsCondition>): AtomicSelector {
        const attrSelector = new AttributeSelector(node.selector.slice(1, node.selector.length - 1), "", "");
        if (node.negate) {
            return new NotSelector(attrSelector);
        }
        return attrSelector;
    }

    private static getAttributeSelectorOperator(value: string): AttributeOperator {
        const s = value.startsWith("%");
        const e = value.endsWith("%");
        if (s && e) return "*=";
        if (s) return "^=";
        if (e) return "$=";
        return "=";
    }
}
