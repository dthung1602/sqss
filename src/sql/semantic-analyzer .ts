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
import { Agg } from "../visitor";
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

export default class SemanticAnalyzer {
    postVisitSqssStyleSheet(node: SqssStyleSheet, context: null, data: SAAgg<SqssStyleSheet>) {}

    preVisitUpdateStatement(node: UpdateStatement, context: null): null {
        assertEqual(node.table, "styles", "Must update table `styles`");
        return null;
    }

    postVisitUpdateStatement(node: UpdateStatement, context: null, data: SAAgg<UpdateStatement>) {}

    preVisitStyleAssignment(node: StyleAssignment, context: null): null {
        assertTrue(isKebabCase(node.property), "CSS properties must be in kebab-case");
        return null;
    }

    postVisitStyleAssignment(node: StyleAssignment, context: null, data: SAAgg<StyleAssignment>) {}

    postVisitAndCondition(node: AndCondition, context: null, data: SAAgg<AndCondition>) {}

    postVisitOrCondition(node: OrCondition, context: null, data: SAAgg<OrCondition>) {}

    preVisitEqualCondition(node: EqualCondition, context: null): null {
        if (isSimpleSelector(node.selector) || isAttrSelector(node.selector)) {
            assertTrue(isString(node.value), "The value of element/id/class must be a string");
            return null;
        }
        if (isPseudoClassSelector(node.selector) || isPseudoElementSelector(node.selector)) {
            assertTrue(isBool(node.value), "The value of pseudo class and pseudo element must be a boolean");
            return null;
        }
        throw new Error(`Cannot recognize selector ${node.selector}`);
    }

    postVisitEqualCondition(node: EqualCondition, context: null, data: SAAgg<EqualCondition>) {}

    preVisitLikeCondition(node: LikeCondition, context: null): null {
        assertTrue(isAttrSelector(node.selector), "Like comparison is only applicable for attribute selector");
        assertTrue(
            node.value.startsWith("%") || node.value.endsWith("%"),
            "The value of like comparison must either start or end with '%'",
        );
        return null;
    }

    postVisitLikeCondition(node: LikeCondition, context: null, data: SAAgg<LikeCondition>) {}

    preVisitIsCondition(node: IsCondition, context: null): null {
        if (isAttrSelector(node.selector)) {
            assertTrue(node.value === null, "For attribute selector, right hand side of IS must be null");
            return null;
        }
        if (isPseudoClassSelector(node.selector) || isPseudoElementSelector(node.selector)) {
            assertTrue(
                isBool(node.value),
                "For pseudo class and pseudo element, right hand side of IS must be boolean",
            );
            return null;
        }
        throw new Error(`Cannot recognize selector ${node.selector}`);
    }

    postVisitIsCondition(node: IsCondition, context: null, data: SAAgg<IsCondition>) {}
}
