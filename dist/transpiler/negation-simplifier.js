"use strict";
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
Object.defineProperty(exports, "__esModule", { value: true });
const ast_1 = require("../sqss/ast");
const utils_1 = require("../utils");
class NegationSimplifier {
    postVisitSqssStyleSheet(node, context, data) {
        return null;
    }
    postVisitUpdateStatement(node, context, data) {
        if (data.where != null) {
            node.where = data.where;
        }
        return null;
    }
    postVisitJoinClause(node, context, data) {
        return null;
    }
    postVisitStyleAssignment(node, context, data) {
        return null;
    }
    postVisitAndExpression(node, context, data) {
        return this.replaceExpression(node, data);
    }
    postVisitOrExpression(node, context, data) {
        return this.replaceExpression(node, data);
    }
    replaceExpression(node, data) {
        if (Array.isArray(data.expressions)) {
            data.expressions.forEach((newNode, i) => {
                if (newNode instanceof ast_1.Expression) {
                    node.expressions[i] = newNode;
                }
            });
        }
        return null;
    }
    postVisitEqualExpression(node, context, data) {
        if ((0, utils_1.isBool)(node.value)) {
            node.negate = !(0, utils_1.xor)(node.negate, node.value);
            node.value = true;
        }
        return null;
    }
    postVisitLikeExpression(node, context, data) {
        return null;
    }
    postVisitIsExpression(node, context, data) {
        if ((0, utils_1.isBool)(node.value)) {
            const negate = !(0, utils_1.xor)(node.negate, node.value);
            return new ast_1.EqualExpression(node.selector, negate, true);
        }
        return null;
    }
    postVisitFuncCallExpression(node, context, data) {
        return null;
    }
    postVisitFieldSelector(node, context, data) {
        return null;
    }
}
exports.default = NegationSimplifier;
//# sourceMappingURL=negation-simplifier.js.map