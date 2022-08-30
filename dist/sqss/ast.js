"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuncCallExpression = exports.LikeExpression = exports.IsExpression = exports.EqualExpression = exports.ComparisonExpression = exports.FieldSelector = exports.AtomicExpression = exports.OrExpression = exports.AndExpression = exports.Expression = exports.StyleAssignment = exports.JoinClause = exports.UpdateStatement = exports.SqssStyleSheet = exports.SqssNode = void 0;
// FIXME why abstract not work
class SqssNode {
}
exports.SqssNode = SqssNode;
class SqssStyleSheet extends SqssNode {
    constructor(updates = []) {
        super();
        this.updates = updates;
    }
}
exports.SqssStyleSheet = SqssStyleSheet;
class UpdateStatement extends SqssNode {
    constructor(table, joins, assignments, where) {
        super();
        this.table = table;
        this.joins = joins;
        this.assignments = assignments;
        this.where = where;
    }
}
exports.UpdateStatement = UpdateStatement;
class JoinClause extends SqssNode {
    constructor(table, alias, on) {
        super();
        this.table = table;
        this.alias = alias;
        this.on = on;
    }
}
exports.JoinClause = JoinClause;
class StyleAssignment extends SqssNode {
    constructor(property, value) {
        super();
        this.property = property;
        this.value = value;
    }
}
exports.StyleAssignment = StyleAssignment;
class Expression extends SqssNode {
}
exports.Expression = Expression;
class AndExpression extends Expression {
    constructor(expressions) {
        super();
        this.expressions = expressions;
    }
}
exports.AndExpression = AndExpression;
class OrExpression extends Expression {
    constructor(expressions) {
        super();
        this.expressions = expressions;
    }
}
exports.OrExpression = OrExpression;
class AtomicExpression extends Expression {
}
exports.AtomicExpression = AtomicExpression;
class FieldSelector extends Expression {
    constructor(field, table = "styles") {
        super();
        this.field = field;
        this.table = table;
    }
}
exports.FieldSelector = FieldSelector;
class ComparisonExpression extends AtomicExpression {
    constructor(selector, negate, value) {
        super();
        this.selector = selector;
        this.negate = negate;
        this.value = value;
    }
}
exports.ComparisonExpression = ComparisonExpression;
class EqualExpression extends ComparisonExpression {
    constructor(selector, negate, value) {
        super(selector, negate, value);
        this.selector = selector;
        this.negate = negate;
        this.value = value;
    }
}
exports.EqualExpression = EqualExpression;
class IsExpression extends ComparisonExpression {
    constructor(selector, negate, value) {
        super(selector, negate, value);
        this.selector = selector;
        this.negate = negate;
        this.value = value;
    }
}
exports.IsExpression = IsExpression;
class LikeExpression extends ComparisonExpression {
    constructor(selector, negate, value) {
        super(selector, negate, value);
        this.selector = selector;
        this.negate = negate;
        this.value = value;
    }
}
exports.LikeExpression = LikeExpression;
class FuncCallExpression extends AtomicExpression {
    constructor(name, args) {
        super();
        this.name = name;
        this.args = args;
    }
}
exports.FuncCallExpression = FuncCallExpression;
//# sourceMappingURL=ast.js.map