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
    FieldSelector,
    FuncCallExpression,
    IsExpression,
    JoinClause,
    LikeExpression,
    OrExpression,
    SqssNode,
    SqssStyleSheet,
    StyleAssignment,
    UpdateStatement,
} from "./ast";

type SAAgg<N> = Agg<N, SqssNode, void>;

export type SAContext = {
    joinTableAliases?: string[];
};

export default class SemanticAnalyzer implements SQSSVisitor<void, SAContext> {
    postVisitSqssStyleSheet(node: SqssStyleSheet, context: SAContext, data: SAAgg<SqssStyleSheet>) {}

    postVisitUpdateStatement(node: UpdateStatement, context: SAContext, data: SAAgg<UpdateStatement>) {
        assertEqual(node.table, "styles", "Must update table styles");
        delete context.joinTableAliases;
    }

    postVisitJoinClause(node: JoinClause, context: SAContext, data: SAAgg<JoinClause>) {
        // table and alias
        assertEqual(node.table, "styles", "Must join table styles");
        if (context.joinTableAliases === undefined) {
            context.joinTableAliases = ["styles"];
        }
        assertTrue(!context.joinTableAliases.includes(node.alias), `Conflicted table alias ${node.alias} when joining`);
        context.joinTableAliases.push(node.alias);
        assertTrue(!node.alias.includes("."));

        // join condition
        assertTrue(
            node.on instanceof IsExpression || node.on instanceof EqualExpression,
            "The join condition must be an = or IS expression",
        );
        const on = node.on as IsExpression | EqualExpression;
        assertTrue(isBool(on.value), `RHS of join condition must be a boolean, got ${on.value}`);
        assertTrue(xor(on.negate, on.value as boolean), "The join condition cannot be a false value");

        // function call in the LHS
        assertTrue(on.selector instanceof FuncCallExpression, "LHS of join condition must be a function");
        const selector = on.selector as FuncCallExpression;
        assertTrue(
            joinConditionFunctions.includes(selector.name),
            `Unsupported function ${selector.name} in join condition`,
        );
        const argsTableAliases: string[] = [];
        for (const arg of selector.args as string[]) {
            const [tableAlias, nodeStr] = arg.split(".");
            if (nodeStr != undefined) {
                argsTableAliases.push(tableAlias);
                assertTrue(
                    context.joinTableAliases.includes(tableAlias),
                    `Unknown table ${tableAlias} is referenced in join expression`,
                );
            }
        }
        assertTrue(
            argsTableAliases.includes(node.alias),
            `Join condition of table ${node.alias} must contain ${node.alias}.node`,
        );
    }

    postVisitStyleAssignment(node: StyleAssignment, context: SAContext, data: SAAgg<StyleAssignment>) {}

    postVisitAndExpression(node: AndExpression, context: SAContext, data: SAAgg<AndExpression>) {}

    postVisitOrExpression(node: OrExpression, context: SAContext, data: SAAgg<OrExpression>) {}

    postVisitEqualExpression(node: EqualExpression, context: SAContext, data: SAAgg<EqualExpression>) {
        if (node.selector instanceof FuncCallExpression) {
            assertTrue(isBool(node.value) || node.value === null, "Function must be compare against bool/null");
            return;
        }
        SemanticAnalyzer.validateIdentifier(node.selector, context);
        if (isSimpleSelector(node.selector.field)) {
            assertTrue(isString(node.value), "The value of element/id/class must be a string");
            return;
        }
        if (isAttrSelector(node.selector.field)) {
            assertTrue(!isBool(node.value), "The value of attribute must be a string/null");
            return;
        }
        if (isPseudoClassSelector(node.selector.field)) {
            assertTrue(isBool(node.value), "The value of pseudo class must be a boolean");
            return;
        }
        if (isPseudoElementSelector(node.selector.field)) {
            assertTrue(isBool(node.value), "The value of pseudo element must be a boolean");
            assertTrue(xor(node.value as boolean, node.negate), "The value of pseudo element must be evaluate to true");
            return;
        }
        throw new Error(`Cannot recognize selector ${node.selector.field}`);
    }

    postVisitLikeExpression(node: LikeExpression, context: SAContext, data: SAAgg<LikeExpression>) {
        assertTrue(!(node.selector instanceof FuncCallExpression), "Like is not applicable to function call");
        const fieldSelector = node.selector as FieldSelector;
        SemanticAnalyzer.validateIdentifier(fieldSelector, context);
        assertTrue(isAttrSelector(fieldSelector.field), "Like comparison is only applicable for attribute selector");
    }

    postVisitIsExpression(node: IsExpression, context: SAContext, data: SAAgg<IsExpression>) {
        if (node.selector instanceof FuncCallExpression) {
            assertTrue(isBool(node.value), "For function call, right hand side of IS must be a boolean");
            return;
        }
        SemanticAnalyzer.validateIdentifier(node.selector, context);
        if (isPseudoClassSelector(node.selector.field) || isPseudoElementSelector(node.selector.field)) {
            assertTrue(
                isBool(node.value),
                "For pseudo class and pseudo element, right hand side of IS must be a boolean",
            );
            return;
        }
        if (isAttrSelector(node.selector.field)) {
            assertTrue(node.value === null, "For attribute selector, right hand side of IS must be null");
            return;
        }
        throw new Error(`Cannot recognize selector ${node.selector.field}`);
    }

    postVisitFieldSelector(node: FieldSelector, context: SAContext, data: SAAgg<FieldSelector>) {}

    private static validateIdentifier(selector: FieldSelector, context: SAContext) {
        if (context.joinTableAliases) {
            assertTrue(
                selector.table === "styles" || context.joinTableAliases.includes(selector.table),
                `Unknown table ${selector.table} is used`,
            );
        }
    }

    postVisitFuncCallExpression(node: FuncCallExpression, context: SAContext, data: SAAgg<FuncCallExpression>) {
        node.name = node.name.toUpperCase();
        assertTrue(functionNames.includes(node.name), `Invalid function name ${node.name}`);
        const validators = functionSignatures[node.name as keyof typeof functionSignatures];
        assertTrue(
            validators.length === node.args.length,
            `Function ${node.name} expects ${validators.length} arguments, got ${node.args.length}`,
        );
        validators.forEach((validate, idx) => {
            if (!validate(node.args[idx])) {
                throw new Error(`Argument ${idx + 1} of ${node.name} is invalid: ${node.args[idx]}`);
            }
        });
    }
}

const joinConditionFunctions = ["IS_ANCESTOR", "IS_PARENT", "IS_PREV", "COMES_BEFORE"];

const functionSignatures: Record<string, ((x: unknown) => boolean)[]> = {
    IS_FIRST_CHILD: [isNodeIdentifier],
    IS_LAST_CHILD: [isNodeIdentifier],
    IS_NTH_CHILD: [isNodeIdentifier, isNonNegativeInteger],
    IS_NTH_LAST_CHILD: [isNodeIdentifier, isNonNegativeInteger],
    IS_ANCESTOR: [isNodeIdentifier, isNodeIdentifier],
    IS_PARENT: [isNodeIdentifier, isNodeIdentifier],
    IS_PREV: [isNodeIdentifier, isNodeIdentifier],
    COMES_BEFORE: [isNodeIdentifier, isNodeIdentifier],
};

const functionNames = Object.keys(functionSignatures);

function isNodeIdentifier(node: unknown): boolean {
    if (!isString(node)) {
        return false;
    }
    const parts = (node as string).split(".");
    if (parts.length === 1) {
        return node === "node";
    }
    if (parts.length === 2) {
        return parts[0] != "" && parts[1] === "node";
    }
    return false;
}
