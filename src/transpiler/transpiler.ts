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
    AndExpression,
    EqualExpression,
    FuncCallExpression,
    IsExpression,
    LikeExpression,
    OrExpression,
    SqssNode,
    SqssStyleSheet,
    StyleAssignment,
    UpdateStatement,
} from "../sqss/ast";
import { isAttrSelector, isPseudoClassSelector, isPseudoElementSelector, trim, trimStart } from "../utils";
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

    postVisitAndExpression(node: AndExpression, context: void, data: STCAgg<AndExpression>): AndSelector {
        return new AndSelector(data.expressions);
    }

    postVisitOrExpression(node: OrExpression, context: void, data: STCAgg<OrExpression>): OrSelector {
        return new OrSelector(data.expressions);
    }

    postVisitEqualExpression(node: EqualExpression, context: void, data: STCAgg<EqualExpression>): AtomicSelector {
        const selector = Transpiler.getSelectorForEqualExpression(node);
        return node.negate ? new NotSelector(selector) : selector;
    }

    private static getSelectorForEqualExpression(node: EqualExpression): AtomicSelector {
        switch (node.selector) {
            case "element":
                return new ElementSelector(node.value as string);
            case "id":
                return new IdSelector(node.value as string);
            case "class":
                return new ClassSelector(node.value as string);
        }
        if (node.selector instanceof FuncCallExpression) {
            throw new Error("Not implemented");
        }
        if (isAttrSelector(node.selector)) {
            if (node.value === null)
                return new AttributeSelector(node.selector.slice(1, node.selector.length - 1), "", "");
            return new AttributeSelector(node.selector.slice(1, node.selector.length - 1), "=", node.value as string);
        }
        if (isPseudoElementSelector(node.selector)) {
            return new PseudoElementSelector(trimStart(node.selector, ":"), node.value as boolean);
        }
        if (isPseudoClassSelector(node.selector)) {
            return new PseudoClassSelector(trimStart(node.selector, ":"), node.value as boolean);
        }
        throw new Error(`Unknown selector: ${node.selector}`);
    }

    postVisitLikeExpression(node: LikeExpression, context: void, data: STCAgg<LikeExpression>): AtomicSelector {
        if (node.selector instanceof FuncCallExpression) {
            throw new Error("Not implemented");
        }
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

    postVisitIsExpression(node: IsExpression, context: void, data: STCAgg<IsExpression>): AtomicSelector {
        if (node.selector instanceof FuncCallExpression) {
            throw new Error("Not implemented");
        }
        const attrSelector = new AttributeSelector(node.selector.slice(1, node.selector.length - 1), "", "");
        if (node.negate) {
            return new NotSelector(attrSelector);
        }
        return attrSelector;
    }

    postVisitFuncCallExpression(node: FuncCallExpression, context: void, data: STCAgg<FuncCallExpression>): CSSNode {
        throw new Error("Not implemented");
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
