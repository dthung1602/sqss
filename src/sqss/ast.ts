// FIXME why abstract not work
export class SqssNode {}

export class SqssStyleSheet extends SqssNode {
    constructor(public updates: UpdateStatement[] = []) {
        super();
    }
}

export class UpdateStatement extends SqssNode {
    constructor(public table: string, public assignments: StyleAssignment[], public where: Expression | null) {
        super();
    }
}

export class StyleAssignment extends SqssNode {
    constructor(public property: string, public value: string) {
        super();
    }
}

export abstract class Expression extends SqssNode {}

export class AndExpression extends Expression {
    constructor(public expressions: Expression[]) {
        super();
    }
}

export class OrExpression extends Expression {
    constructor(public expressions: Expression[]) {
        super();
    }
}

export abstract class AtomicExpression extends Expression {}

export abstract class ComparisonExpression extends AtomicExpression {
    protected constructor(
        public selector: string | FuncCallExpression,
        public negate: boolean,
        public value: string | boolean | null,
    ) {
        super();
    }
}

export class EqualExpression extends ComparisonExpression {
    constructor(
        public selector: string | FuncCallExpression,
        public negate: boolean,
        public value: string | boolean | null,
    ) {
        super(selector, negate, value);
    }
}

export class IsExpression extends ComparisonExpression {
    constructor(public selector: string | FuncCallExpression, public negate: boolean, public value: boolean | null) {
        super(selector, negate, value);
    }
}

export class LikeExpression extends ComparisonExpression {
    constructor(public selector: string | FuncCallExpression, public negate: boolean, public value: string) {
        super(selector, negate, value);
    }
}

export class FuncCallExpression extends AtomicExpression {
    constructor(public name: string, public args: (string | boolean | number | null)[]) {
        super();
    }
}
