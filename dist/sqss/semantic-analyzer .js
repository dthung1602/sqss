"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
const utils_1 = require("../utils");
const ast_1 = require("./ast");
class SemanticAnalyzer {
    postVisitSqssStyleSheet(node, context, data) { }
    postVisitUpdateStatement(node, context, data) {
        (0, utils_1.assertEqual)(node.table, "styles", "Must update table styles");
        delete context.joinTableAliases;
    }
    postVisitJoinClause(node, context, data) {
        // table and alias
        (0, utils_1.assertEqual)(node.table, "styles", "Must join table styles");
        if (context.joinTableAliases === undefined) {
            context.joinTableAliases = ["styles"];
        }
        (0, utils_1.assertTrue)(!context.joinTableAliases.includes(node.alias), `Conflicted table alias ${node.alias} when joining`);
        context.joinTableAliases.push(node.alias);
        (0, utils_1.assertTrue)(!node.alias.includes("."));
        // join condition
        (0, utils_1.assertTrue)(node.on instanceof ast_1.IsExpression || node.on instanceof ast_1.EqualExpression, "The join condition must be an = or IS expression");
        const on = node.on;
        (0, utils_1.assertTrue)((0, utils_1.isBool)(on.value), `RHS of join condition must be a boolean, got ${on.value}`);
        (0, utils_1.assertTrue)((0, utils_1.xor)(on.negate, on.value), "The join condition cannot be a false value");
        // function call in the LHS
        (0, utils_1.assertTrue)(on.selector instanceof ast_1.FuncCallExpression, "LHS of join condition must be a function");
        const selector = on.selector;
        (0, utils_1.assertTrue)(joinConditionFunctions.includes(selector.name), `Unsupported function ${selector.name} in join condition`);
        const argsTableAliases = [];
        for (const arg of selector.args) {
            const [tableAlias, nodeStr] = arg.split(".");
            if (nodeStr != undefined) {
                argsTableAliases.push(tableAlias);
                (0, utils_1.assertTrue)(context.joinTableAliases.includes(tableAlias), `Unknown table ${tableAlias} is referenced in join expression`);
            }
        }
        (0, utils_1.assertTrue)(argsTableAliases.includes(node.alias), `Join condition of table ${node.alias} must contain ${node.alias}.node`);
    }
    postVisitStyleAssignment(node, context, data) { }
    postVisitAndExpression(node, context, data) { }
    postVisitOrExpression(node, context, data) { }
    postVisitEqualExpression(node, context, data) {
        if (node.selector instanceof ast_1.FuncCallExpression) {
            (0, utils_1.assertTrue)((0, utils_1.isBool)(node.value) || node.value === null, "Function must be compare against bool/null");
            return;
        }
        SemanticAnalyzer.validateIdentifier(node.selector, context);
        if ((0, utils_1.isSimpleSelector)(node.selector.field)) {
            (0, utils_1.assertTrue)((0, utils_1.isString)(node.value), "The value of element/id/class must be a string");
            return;
        }
        if ((0, utils_1.isAttrSelector)(node.selector.field)) {
            (0, utils_1.assertTrue)(!(0, utils_1.isBool)(node.value), "The value of attribute must be a string/null");
            return;
        }
        if ((0, utils_1.isPseudoClassSelector)(node.selector.field)) {
            (0, utils_1.assertTrue)((0, utils_1.isBool)(node.value), "The value of pseudo class must be a boolean");
            return;
        }
        if ((0, utils_1.isPseudoElementSelector)(node.selector.field)) {
            (0, utils_1.assertTrue)((0, utils_1.isBool)(node.value), "The value of pseudo element must be a boolean");
            (0, utils_1.assertTrue)((0, utils_1.xor)(node.value, node.negate), "The value of pseudo element must be evaluate to true");
            return;
        }
        throw new Error(`Cannot recognize selector ${node.selector.field}`);
    }
    postVisitLikeExpression(node, context, data) {
        (0, utils_1.assertTrue)(!(node.selector instanceof ast_1.FuncCallExpression), "Like is not applicable to function call");
        const fieldSelector = node.selector;
        SemanticAnalyzer.validateIdentifier(fieldSelector, context);
        (0, utils_1.assertTrue)((0, utils_1.isAttrSelector)(fieldSelector.field), "Like comparison is only applicable for attribute selector");
    }
    postVisitIsExpression(node, context, data) {
        if (node.selector instanceof ast_1.FuncCallExpression) {
            (0, utils_1.assertTrue)((0, utils_1.isBool)(node.value), "For function call, right hand side of IS must be a boolean");
            return;
        }
        SemanticAnalyzer.validateIdentifier(node.selector, context);
        if ((0, utils_1.isPseudoClassSelector)(node.selector.field) || (0, utils_1.isPseudoElementSelector)(node.selector.field)) {
            (0, utils_1.assertTrue)((0, utils_1.isBool)(node.value), "For pseudo class and pseudo element, right hand side of IS must be a boolean");
            return;
        }
        if ((0, utils_1.isAttrSelector)(node.selector.field)) {
            (0, utils_1.assertTrue)(node.value === null, "For attribute selector, right hand side of IS must be null");
            return;
        }
        throw new Error(`Cannot recognize selector ${node.selector.field}`);
    }
    postVisitFieldSelector(node, context, data) { }
    static validateIdentifier(selector, context) {
        if (context.joinTableAliases) {
            (0, utils_1.assertTrue)(selector.table === "styles" || context.joinTableAliases.includes(selector.table), `Unknown table ${selector.table} is used`);
        }
    }
    postVisitFuncCallExpression(node, context, data) {
        node.name = node.name.toUpperCase();
        (0, utils_1.assertTrue)(functionNames.includes(node.name), `Invalid function name ${node.name}`);
        const validators = functionSignatures[node.name];
        (0, utils_1.assertTrue)(validators.length === node.args.length, `Function ${node.name} expects ${validators.length} arguments, got ${node.args.length}`);
        validators.forEach((validate, idx) => {
            if (!validate(node.args[idx])) {
                throw new Error(`Argument ${idx + 1} of ${node.name} is invalid: ${node.args[idx]}`);
            }
        });
    }
}
exports.default = SemanticAnalyzer;
const joinConditionFunctions = ["IS_ANCESTOR", "IS_PARENT", "IS_PREV", "COMES_BEFORE"];
const functionSignatures = {
    IS_FIRST_CHILD: [isNodeIdentifier],
    IS_LAST_CHILD: [isNodeIdentifier],
    IS_NTH_CHILD: [isNodeIdentifier, utils_1.isNonNegativeInteger],
    IS_NTH_LAST_CHILD: [isNodeIdentifier, utils_1.isNonNegativeInteger],
    IS_ANCESTOR: [isNodeIdentifier, isNodeIdentifier],
    IS_PARENT: [isNodeIdentifier, isNodeIdentifier],
    IS_PREV: [isNodeIdentifier, isNodeIdentifier],
    COMES_BEFORE: [isNodeIdentifier, isNodeIdentifier],
};
const functionNames = Object.keys(functionSignatures);
function isNodeIdentifier(node) {
    if (!(0, utils_1.isString)(node)) {
        return false;
    }
    const parts = node.split(".");
    if (parts.length === 1) {
        return node === "node";
    }
    if (parts.length === 2) {
        return parts[0] != "" && parts[1] === "node";
    }
    return false;
}
//# sourceMappingURL=semantic-analyzer%20.js.map