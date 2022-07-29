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
    xor,
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

    postVisitUpdateStatement(node: UpdateStatement, context: void, data: SAAgg<UpdateStatement>) {
        assertEqual(node.table, "styles", "Must update table styles");
    }

    postVisitStyleAssignment(node: StyleAssignment, context: void, data: SAAgg<StyleAssignment>) {}

    postVisitAndCondition(node: AndCondition, context: void, data: SAAgg<AndCondition>) {}

    postVisitOrCondition(node: OrCondition, context: void, data: SAAgg<OrCondition>) {}

    postVisitEqualCondition(node: EqualCondition, context: void, data: SAAgg<EqualCondition>) {
        if (isSimpleSelector(node.selector)) {
            assertTrue(isString(node.value), "The value of element/id/class must be a string");
            return;
        }
        if (isAttrSelector(node.selector)) {
            assertTrue(!isBool(node.value), "The value of attribute must be a string/null");
            return;
        }
        if (isPseudoClassSelector(node.selector)) {
            assertTrue(isBool(node.value), "The value of pseudo class must be a boolean");
            return;
        }
        if (isPseudoElementSelector(node.selector)) {
            assertTrue(isBool(node.value), "The value of pseudo element must be a boolean");
            assertTrue(xor(node.value as boolean, node.negate), "The value of pseudo element must be evaluate to true");
            return;
        }
        throw new Error(`Cannot recognize selector ${node.selector}`);
    }

    postVisitLikeCondition(node: LikeCondition, context: void, data: SAAgg<LikeCondition>) {
        assertTrue(isAttrSelector(node.selector), "Like comparison is only applicable for attribute selector");
    }

    postVisitIsCondition(node: IsCondition, context: void, data: SAAgg<IsCondition>) {
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
}
