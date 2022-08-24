/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import {
    AJSelector,
    AllSelector,
    AndSelector,
    AtomicSelector,
    AttributeOperator,
    AttributeSelector,
    ChildSelector,
    ClassSelector,
    CSSNode,
    CSSStyleSheet,
    DescendantSelector,
    ElementSelector,
    FirstChild,
    IdSelector,
    ImmediatePrecedeSelector,
    JoinSelector,
    LastChild,
    NoOp,
    NotSelector,
    NthChild,
    NthLastChild,
    OrSelector,
    PrecedeSelector,
    PseudoClassSelector,
    PseudoElementSelector,
    StyleDeclaration,
    StyleRule,
} from "../css/ast";
import { SAContext } from "../sqss";
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
} from "../sqss/ast";
import {
    assertTrue,
    extractTableFromSelector,
    isAttrSelector,
    isPseudoClassSelector,
    isPseudoElementSelector,
    trim,
    trimStart,
} from "../utils";
import { Agg, SQSSVisitor } from "../visitor";

type TPAgg<N> = Agg<N, SqssNode, CSSNode>;
type JoinSelectorClass = { new (a: AJSelector, b: AJSelector): JoinSelector };
export type TPContext = {
    joinGraph?: {
        left: string;
        right: string;
        selectorClass: JoinSelectorClass;
    }[];
};

export default class Transpiler implements SQSSVisitor<CSSNode, TPContext> {
    postVisitSqssStyleSheet(node: SqssStyleSheet, context: TPContext, data: TPAgg<SqssStyleSheet>): CSSStyleSheet {
        return new CSSStyleSheet(data.updates as StyleRule[]);
    }

    postVisitUpdateStatement(node: UpdateStatement, context: TPContext, data: TPAgg<UpdateStatement>): StyleRule {
        const where = data.where ? data.where : new AllSelector("styles");
        const styleRule = new StyleRule(where, data.assignments as StyleDeclaration[]);
        delete context.joinGraph;
        return styleRule;
    }

    postVisitJoinClause(node: JoinClause, context: TPContext, data: TPAgg<JoinClause>): NoOp {
        return new NoOp();
    }

    postVisitStyleAssignment(
        node: StyleAssignment,
        context: TPContext,
        data: TPAgg<StyleAssignment>,
    ): StyleDeclaration {
        return new StyleDeclaration(node.property, node.value);
    }

    postVisitAndExpression(
        node: AndExpression,
        context: TPContext,
        data: TPAgg<AndExpression>,
    ): AndSelector | JoinSelector {
        if (!context.joinGraph?.length) {
            return new AndSelector(data.expressions as AtomicSelector[]);
        }

        const groups: Record<string, AtomicSelector[]> = {};
        for (const selector of data.expressions as AtomicSelector[]) {
            if (groups[selector.group] === undefined) {
                groups[selector.group] = [];
            }
            groups[selector.group].push(selector);
        }

        let selector: AJSelector = new AndSelector(groups[context.joinGraph[0].right]);
        for (const { left, selectorClass } of context.joinGraph) {
            const leftSelector = new AndSelector(groups[left]);
            selector = new selectorClass(leftSelector, selector);
        }
        return selector;
    }

    private static getJoinSelectorClass() {
        return {};
    }

    postVisitOrExpression(node: OrExpression, context: TPContext, data: TPAgg<OrExpression>): OrSelector {
        return new OrSelector(data.expressions as AtomicSelector[]);
    }

    postVisitEqualExpression(
        node: EqualExpression,
        context: TPContext,
        data: TPAgg<EqualExpression>,
    ): AtomicSelector | NoOp {
        const selector = Transpiler.getSelectorForEqualExpression(node, data);
        return node.negate ? new NotSelector(selector as AtomicSelector) : selector;
    }

    private static getSelectorForEqualExpression(
        node: EqualExpression,
        data: TPAgg<EqualExpression>,
    ): AtomicSelector | NoOp {
        if (node.selector instanceof FuncCallExpression) {
            return data.selector;
        }
        const { field, table } = node.selector;
        switch (field) {
            case "element":
                return new ElementSelector(node.value as string, table);
            case "id":
                return new IdSelector(node.value as string, table);
            case "class":
                return new ClassSelector(node.value as string, table);
        }

        if (isAttrSelector(field)) {
            if (node.value === null) {
                return new AttributeSelector(field.slice(1, field.length - 1), "", "", table);
            }
            return new AttributeSelector(field.slice(1, field.length - 1), "=", node.value as string, table);
        }
        if (isPseudoElementSelector(field)) {
            return new PseudoElementSelector(trimStart(field, ":"), node.value as boolean, table);
        }
        if (isPseudoClassSelector(field)) {
            return new PseudoClassSelector(trimStart(field, ":"), node.value as boolean, table);
        }
        throw new Error(`Unknown selector: ${field}`);
    }

    postVisitLikeExpression(node: LikeExpression, context: TPContext, data: TPAgg<LikeExpression>): AtomicSelector {
        if (node.selector instanceof FuncCallExpression) {
            throw new Error("Not implemented");
        }
        const attrSelector = new AttributeSelector(
            node.selector.field.slice(1, node.selector.field.length - 1),
            Transpiler.getAttributeSelectorOperator(node.value),
            trim(node.value, "%"),
            node.selector.table,
        );
        if (node.negate) {
            return new NotSelector(attrSelector);
        }
        return attrSelector;
    }

    postVisitIsExpression(node: IsExpression, context: TPContext, data: TPAgg<IsExpression>): AtomicSelector {
        if (node.selector instanceof FuncCallExpression) {
            throw new Error("Not implemented");
        }
        const attrSelector = new AttributeSelector(
            node.selector.field.slice(1, node.selector.field.length - 1),
            "",
            "",
            node.selector.table,
        );
        if (node.negate) {
            return new NotSelector(attrSelector);
        }
        return attrSelector;
    }

    postVisitFieldSelector(node: FieldSelector, context: TPContext, data: TPAgg<FieldSelector>): NoOp {
        return new NoOp();
    }

    postVisitFuncCallExpression(
        node: FuncCallExpression,
        context: TPContext,
        data: TPAgg<FuncCallExpression>,
    ): CSSNode {
        const table = extractTableFromSelector(node.args[0] as string);
        switch (node.name) {
            case "IS_FIRST_CHILD":
                return new FirstChild(table);
            case "IS_LAST_CHILD":
                return new LastChild(table);
            case "IS_NTH_CHILD":
                return new NthChild(node.args[1] as number, table);
            case "IS_NTH_LAST_CHILD":
                return new NthLastChild(node.args[1] as number, table);
            default:
                Transpiler.buildJoinGraph(node, context);
                Transpiler.verifyJoinGraph(context);
                return new NoOp();
        }
    }

    private static buildJoinGraph(node: FuncCallExpression, context: TPContext) {
        const mapping = {
            IS_ANCESTOR: DescendantSelector,
            IS_PARENT: ChildSelector,
            IS_PREV: ImmediatePrecedeSelector,
            COMES_BEFORE: PrecedeSelector,
        };
        const klass = mapping[node.name as keyof typeof mapping];
        if (klass === undefined) {
            throw new Error(`Unknown function ${node.name}`);
        }
        const join = {
            left: this.getTableName(node.args[0] as string),
            right: this.getTableName(node.args[1] as string),
            selectorClass: klass,
        };
        if (context.joinGraph === undefined) {
            context.joinGraph = [];
        }
        context.joinGraph.push(join);
    }

    private static getTableName(str: string): string {
        const parts = str.split(".");
        if (parts.length === 2) {
            return parts[0];
        }
        return "styles";
    }

    private static verifyJoinGraph(context: TPContext) {
        const graph = context.joinGraph as Exclude<typeof context.joinGraph, undefined>;
        if (graph.length === 1) {
            assertTrue(graph[0].right === "styles", `Must join with style table first`);
            return;
        }
        assertTrue(
            graph[graph.length - 1].right === graph[graph.length - 2].left,
            `Join clause must be in consecutive order`,
        );
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
