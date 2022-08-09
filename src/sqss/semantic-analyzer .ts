/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    assertEqual,
    assertTrue,
    isAttrSelector,
    isBool,
    isNonNegativeInteger,
    isPseudoClassSelector,
    isPseudoElementSelector,
    isSimpleSelector,
    isString,
    xor,
} from "../utils";
import { Agg, SQSSVisitor } from "../visitor";
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
} from "./ast";

type SAAgg<N> = Agg<N, SqssNode, void>;

export default class SemanticAnalyzer implements SQSSVisitor<void, void> {
    postVisitSqssStyleSheet(node: SqssStyleSheet, context: void, data: SAAgg<SqssStyleSheet>) {}

    postVisitUpdateStatement(node: UpdateStatement, context: void, data: SAAgg<UpdateStatement>) {
        assertEqual(node.table, "styles", "Must update table styles");
    }

    postVisitStyleAssignment(node: StyleAssignment, context: void, data: SAAgg<StyleAssignment>) {}

    postVisitAndExpression(node: AndExpression, context: void, data: SAAgg<AndExpression>) {}

    postVisitOrExpression(node: OrExpression, context: void, data: SAAgg<OrExpression>) {}

    postVisitEqualExpression(node: EqualExpression, context: void, data: SAAgg<EqualExpression>) {
        if (node.selector instanceof FuncCallExpression) {
            assertTrue(isBool(node.value) || node.value === null, "Function must be compare against bool/null");
            return;
        }
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

    postVisitLikeExpression(node: LikeExpression, context: void, data: SAAgg<LikeExpression>) {
        assertTrue(!(node.selector instanceof FuncCallExpression), "Like is not applicable to function call");
        assertTrue(
            isAttrSelector(node.selector as string),
            "Like comparison is only applicable for attribute selector",
        );
    }

    postVisitIsExpression(node: IsExpression, context: void, data: SAAgg<IsExpression>) {
        if (
            node.selector instanceof FuncCallExpression ||
            isPseudoClassSelector(node.selector) ||
            isPseudoElementSelector(node.selector)
        ) {
            assertTrue(
                isBool(node.value),
                "For pseudo class, pseudo element and function call, right hand side of IS must be boolean",
            );
            return;
        }
        if (isAttrSelector(node.selector)) {
            assertTrue(node.value === null, "For attribute selector, right hand side of IS must be null");
            return;
        }
        throw new Error(`Cannot recognize selector ${node.selector}`);
    }

    postVisitFuncCallExpression(node: FuncCallExpression, context: void, data: SAAgg<FuncCallExpression>) {
        node.name = node.name.toUpperCase();
        assertTrue(functionNames.includes(node.name), `Invalid function name ${node.name}`);
        const validators = functionSignatures[node.name as keyof typeof functionSignatures];
        validators.forEach((validate, idx) => {
            if (!validate(node.args[idx])) {
                throw new Error(`Argument ${idx + 1} of ${node.name} is invalid: ${node.args[idx]}`);
            }
        });
    }
}

const functionSignatures: Record<string, ((x: unknown) => boolean)[]> = {
    IS_FIRST_CHILD: [isNodeIdentifier],
    IS_LAST_CHILD: [isNodeIdentifier],
    IS_NTH_CHILD: [isNodeIdentifier, isNonNegativeInteger],
    IS_NTH_LAST_CHILD: [isNodeIdentifier, isNonNegativeInteger],
    // TODO
    IS_ANCESTOR: [],
    IS_PARENT: [],
    IS_PREV: [],
    COMES_BEFORE: [],
};

const functionNames = Object.keys(functionSignatures);

function isNodeIdentifier(node: unknown) {
    return node === "node";
}
