export declare class SqssNode {
}
export declare class SqssStyleSheet extends SqssNode {
    updates: UpdateStatement[];
    constructor(updates?: UpdateStatement[]);
}
export declare class UpdateStatement extends SqssNode {
    table: string;
    joins: JoinClause[];
    assignments: StyleAssignment[];
    where: Expression | null;
    constructor(table: string, joins: JoinClause[], assignments: StyleAssignment[], where: Expression | null);
}
export declare class JoinClause extends SqssNode {
    table: string;
    alias: string;
    on: Expression;
    constructor(table: string, alias: string, on: Expression);
}
export declare class StyleAssignment extends SqssNode {
    property: string;
    value: string;
    constructor(property: string, value: string);
}
export declare abstract class Expression extends SqssNode {
}
export declare class AndExpression extends Expression {
    expressions: Expression[];
    constructor(expressions: Expression[]);
}
export declare class OrExpression extends Expression {
    expressions: Expression[];
    constructor(expressions: Expression[]);
}
export declare abstract class AtomicExpression extends Expression {
}
export declare class FieldSelector extends Expression {
    field: string;
    table: string;
    constructor(field: string, table?: string);
}
export declare abstract class ComparisonExpression extends AtomicExpression {
    selector: FieldSelector | FuncCallExpression;
    negate: boolean;
    value: string | boolean | null;
    protected constructor(selector: FieldSelector | FuncCallExpression, negate: boolean, value: string | boolean | null);
}
export declare class EqualExpression extends ComparisonExpression {
    selector: FieldSelector | FuncCallExpression;
    negate: boolean;
    value: string | boolean | null;
    constructor(selector: FieldSelector | FuncCallExpression, negate: boolean, value: string | boolean | null);
}
export declare class IsExpression extends ComparisonExpression {
    selector: FieldSelector | FuncCallExpression;
    negate: boolean;
    value: boolean | null;
    constructor(selector: FieldSelector | FuncCallExpression, negate: boolean, value: boolean | null);
}
export declare class LikeExpression extends ComparisonExpression {
    selector: FieldSelector | FuncCallExpression;
    negate: boolean;
    value: string;
    constructor(selector: FieldSelector | FuncCallExpression, negate: boolean, value: string);
}
export declare class FuncCallExpression extends AtomicExpression {
    name: string;
    args: (string | boolean | number | null)[];
    constructor(name: string, args: (string | boolean | number | null)[]);
}
