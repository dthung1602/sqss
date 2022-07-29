/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    assertEqual,
    assertTrue,
    isAttrSelector,
    isBool,
    isKebabCase,
    isPseudoClassSelector,
    isPseudoElementSelector,
    isSimpleSelector,
    isString,
} from "../utils";
import { Agg, SQSSVisitor } from "../visitor";
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
} from "./ast";

type SAAgg<N> = Agg<N, SqssNode, void>;

export default class SemanticAnalyzer implements SQSSVisitor<void, void> {
    postVisitSqssStyleSheet(node: SqssStyleSheet, context: void, data: SAAgg<SqssStyleSheet>) {}

    preVisitUpdateStatement(node: UpdateStatement, context: void) {
        assertEqual(node.table, "styles", "Must update table styles");
    }

    postVisitUpdateStatement(node: UpdateStatement, context: void, data: SAAgg<UpdateStatement>) {}

    preVisitStyleAssignment(node: StyleAssignment, context: void) {
        assertTrue(isKebabCase(node.property), "CSS properties must be in kebab-case");
    }

    postVisitStyleAssignment(node: StyleAssignment, context: void, data: SAAgg<StyleAssignment>) {}

    postVisitAndCondition(node: AndCondition, context: void, data: SAAgg<AndCondition>) {}

    postVisitOrCondition(node: OrCondition, context: void, data: SAAgg<OrCondition>) {}

    preVisitEqualCondition(node: EqualCondition, context: void) {
        if (isSimpleSelector(node.selector) || isAttrSelector(node.selector)) {
            assertTrue(isString(node.value), "The value of element/id/class must be a string");
            return;
        }
        if (isPseudoClassSelector(node.selector) || isPseudoElementSelector(node.selector)) {
            assertTrue(isBool(node.value), "The value of pseudo class and pseudo element must be a boolean");
            return;
        }
        throw new Error(`Cannot recognize selector ${node.selector}`);
    }

    postVisitEqualCondition(node: EqualCondition, context: void, data: SAAgg<EqualCondition>) {
        if (isAttrSelector(node.selector)) {
            assertTrue(isString(node.value), "Attribute selector must equal a string");
        }
    }

    preVisitLikeCondition(node: LikeCondition, context: void) {
        assertTrue(isAttrSelector(node.selector), "Like comparison is only applicable for attribute selector");
        assertTrue(
            node.value.startsWith("%") || node.value.endsWith("%"),
            "The value of like comparison must either start or end with '%'",
        );
    }

    postVisitLikeCondition(node: LikeCondition, context: void, data: SAAgg<LikeCondition>) {}

    preVisitIsCondition(node: IsCondition, context: void) {
        if (isAttrSelector(node.selector)) {
            assertTrue(node.value === null, "For attribute selector, right hand side of IS must be null");
            return;
        }
        if (isPseudoClassSelector(node.selector) || isPseudoElementSelector(node.selector)) {
            assertTrue(
                isBool(node.value),
                "For pseudo class and pseudo element, right hand side of IS must be boolean",
            );
            return;
        }
        throw new Error(`Cannot recognize selector ${node.selector}`);
    }

    postVisitIsCondition(node: IsCondition, context: void, data: SAAgg<IsCondition>) {}
}
