"use strict";
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
Object.defineProperty(exports, "__esModule", { value: true });
const ast_1 = require("../css/ast");
const ast_2 = require("../sqss/ast");
const utils_1 = require("../utils");
class Transpiler {
    postVisitSqssStyleSheet(node, context, data) {
        return new ast_1.CSSStyleSheet(data.updates);
    }
    postVisitUpdateStatement(node, context, data) {
        const where = data.where ? data.where : new ast_1.AllSelector("styles");
        const styleRule = new ast_1.StyleRule(where, data.assignments);
        delete context.joinGraph;
        return styleRule;
    }
    postVisitJoinClause(node, context, data) {
        return new ast_1.NoOp();
    }
    postVisitStyleAssignment(node, context, data) {
        return new ast_1.StyleDeclaration(node.property, node.value);
    }
    postVisitAndExpression(node, context, data) {
        var _a;
        if (!((_a = context.joinGraph) === null || _a === void 0 ? void 0 : _a.length)) {
            return new ast_1.AndSelector(data.expressions);
        }
        const groups = {};
        for (const selector of data.expressions) {
            if (groups[selector.group] === undefined) {
                groups[selector.group] = [];
            }
            groups[selector.group].push(selector);
        }
        let selector = Transpiler.getSelectorFromGroup(groups, context.joinGraph[0].right);
        for (const { left, selectorClass } of context.joinGraph) {
            const leftSelector = Transpiler.getSelectorFromGroup(groups, left);
            selector = new selectorClass(leftSelector, selector);
        }
        return selector;
    }
    static getSelectorFromGroup(groups, key) {
        const selectors = groups[key];
        if (selectors === undefined) {
            return new ast_1.AllSelector(key);
        }
        return new ast_1.AndSelector(selectors);
    }
    postVisitOrExpression(node, context, data) {
        return new ast_1.OrSelector(data.expressions);
    }
    postVisitEqualExpression(node, context, data) {
        const selector = Transpiler.getSelectorForEqualExpression(node, data);
        let { negate } = node;
        // reverse negate for [attribute] = null case
        if (selector instanceof ast_1.AttributeSelector && selector.value === "") {
            negate = !negate;
        }
        return negate ? new ast_1.NotSelector(selector) : selector;
    }
    static getSelectorForEqualExpression(node, data) {
        if (node.selector instanceof ast_2.FuncCallExpression) {
            return data.selector;
        }
        const { field, table } = node.selector;
        switch (field) {
            case "element":
                return new ast_1.ElementSelector(node.value, table);
            case "id":
                return new ast_1.IdSelector(node.value, table);
            case "class":
                return new ast_1.ClassSelector(node.value, table);
        }
        if ((0, utils_1.isAttrSelector)(field)) {
            if (node.value === null) {
                return new ast_1.AttributeSelector(field.slice(1, field.length - 1), "", "", table);
            }
            return new ast_1.AttributeSelector(field.slice(1, field.length - 1), "=", node.value, table);
        }
        if ((0, utils_1.isPseudoElementSelector)(field)) {
            return new ast_1.PseudoElementSelector((0, utils_1.trimStart)(field, ":"), node.value, table);
        }
        if ((0, utils_1.isPseudoClassSelector)(field)) {
            return new ast_1.PseudoClassSelector((0, utils_1.trimStart)(field, ":"), node.value, table);
        }
        throw new Error(`Unknown selector: ${field}`);
    }
    postVisitLikeExpression(node, context, data) {
        if (node.selector instanceof ast_2.FuncCallExpression) {
            throw new Error("Left side of LIKE can't be a function call");
        }
        const attrSelector = new ast_1.AttributeSelector(node.selector.field.slice(1, node.selector.field.length - 1), Transpiler.getAttributeSelectorOperator(node.value), (0, utils_1.trim)(node.value, "%"), node.selector.table);
        if (node.negate) {
            return new ast_1.NotSelector(attrSelector);
        }
        return attrSelector;
    }
    postVisitIsExpression(node, context, data) {
        if (node.selector instanceof ast_2.FuncCallExpression) {
            throw new Error("Left side of IS can't be a function call");
        }
        const attrSelector = new ast_1.AttributeSelector(node.selector.field.slice(1, node.selector.field.length - 1), "", "", node.selector.table);
        // reverse negate for [attribute] = null case
        if (!node.negate) {
            return new ast_1.NotSelector(attrSelector);
        }
        return attrSelector;
    }
    postVisitFieldSelector(node, context, data) {
        return new ast_1.NoOp();
    }
    postVisitFuncCallExpression(node, context, data) {
        const table = (0, utils_1.extractTableFromSelector)(node.args[0]);
        switch (node.name) {
            case "IS_FIRST_CHILD":
                return new ast_1.FirstChild(table);
            case "IS_LAST_CHILD":
                return new ast_1.LastChild(table);
            case "IS_NTH_CHILD":
                return new ast_1.NthChild(node.args[1], table);
            case "IS_NTH_LAST_CHILD":
                return new ast_1.NthLastChild(node.args[1], table);
            default:
                Transpiler.buildJoinGraph(node, context);
                Transpiler.verifyJoinGraph(context);
                return new ast_1.NoOp();
        }
    }
    static buildJoinGraph(node, context) {
        const mapping = {
            IS_ANCESTOR: ast_1.DescendantSelector,
            IS_PARENT: ast_1.ChildSelector,
            IS_PREV: ast_1.ImmediatePrecedeSelector,
            COMES_BEFORE: ast_1.PrecedeSelector,
        };
        const klass = mapping[node.name];
        if (klass === undefined) {
            throw new Error(`Unknown function ${node.name}`);
        }
        const join = {
            left: this.getTableName(node.args[0]),
            right: this.getTableName(node.args[1]),
            selectorClass: klass,
        };
        if (context.joinGraph === undefined) {
            context.joinGraph = [];
        }
        context.joinGraph.push(join);
    }
    static getTableName(str) {
        const parts = str.split(".");
        if (parts.length === 2) {
            return parts[0];
        }
        return "styles";
    }
    static verifyJoinGraph(context) {
        const graph = context.joinGraph;
        if (graph.length === 1) {
            (0, utils_1.assertTrue)(graph[0].right === "styles", `Must join with style table first`);
            return;
        }
        (0, utils_1.assertTrue)(graph[graph.length - 1].right === graph[graph.length - 2].left, `Join clause must be in consecutive order`);
    }
    static getAttributeSelectorOperator(value) {
        const s = value.startsWith("%");
        const e = value.endsWith("%");
        if (s && e)
            return "*=";
        if (s)
            return "^=";
        if (e)
            return "$=";
        return "=";
    }
}
exports.default = Transpiler;
//# sourceMappingURL=transpiler.js.map