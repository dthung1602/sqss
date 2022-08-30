"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
const ast_1 = require("../sqss/ast");
const utils_1 = require("../utils");
class FlattenExpression {
    postVisitSqssStyleSheet(node, context, data) {
        return null;
    }
    postVisitUpdateStatement(node, context, data) {
        return null;
    }
    postVisitJoinClause(node, context, data) {
        return null;
    }
    postVisitStyleAssignment(node, context, data) {
        return null;
    }
    postVisitAndExpression(node, context, data) {
        this.replaceExpression(node, data);
        this.flatten(node, ast_1.AndExpression);
        return this.distribute(node);
    }
    postVisitOrExpression(node, context, data) {
        this.replaceExpression(node, data);
        this.flatten(node, ast_1.OrExpression);
        return null;
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
    flatten(node, expressionClass) {
        let newExpressions = [];
        node.expressions.forEach((subExpression) => {
            if (subExpression instanceof expressionClass) {
                newExpressions = newExpressions.concat(subExpression.expressions);
            }
            else {
                newExpressions.push(subExpression);
            }
        });
        node.expressions = newExpressions;
    }
    distribute(node) {
        const comparisonExpressions = node.expressions.filter((c) => c instanceof ast_1.ComparisonExpression);
        if (comparisonExpressions.length === node.expressions.length) {
            return null;
        }
        const orExpressions = node.expressions.filter((c) => c instanceof ast_1.OrExpression);
        const products = (0, utils_1.cartesian)(...orExpressions.map((c) => c.expressions));
        return new ast_1.OrExpression(products.map((cons) => new ast_1.AndExpression([...comparisonExpressions, ...cons])));
    }
    postVisitEqualExpression(node, context, data) {
        return null;
    }
    postVisitLikeExpression(node, context, data) {
        return null;
    }
    postVisitIsExpression(node, context, data) {
        return null;
    }
    postVisitFuncCallExpression(node, context, data) {
        return null;
    }
    postVisitFieldSelector(node, context, data) {
        return null;
    }
}
exports.default = FlattenExpression;
//# sourceMappingURL=flatten-expression.js.map