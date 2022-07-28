// FIXME why abstract not work
export class SqssNode {}

export class SqssStyleSheet extends SqssNode {
    constructor(public updates: UpdateStatement[] = []) {
        super();
    }
}

export class UpdateStatement extends SqssNode {
    constructor(public table: string, public assignments: StyleAssignment[], public where: Condition | null) {
        super();
    }
}

export class StyleAssignment extends SqssNode {
    constructor(public property: string, public value: string | boolean) {
        super();
    }
}

export abstract class Condition extends SqssNode {}

export class AndCondition extends Condition {
    constructor(public conditions: Condition[]) {
        super();
    }
}

export class OrCondition extends Condition {
    constructor(public conditions: Condition[]) {
        super();
    }
}

export abstract class AtomicCondition extends Condition {
    protected constructor(public selector: string, public negate: boolean, public value: string | boolean | null) {
        super();
    }
}

export class EqualCondition extends AtomicCondition {
    constructor(public selector: string, public negate: boolean, public value: string | boolean | null) {
        super(selector, negate, value);
    }
}

export class IsCondition extends AtomicCondition {
    constructor(public selector: string, public negate: boolean, public value: boolean | null) {
        super(selector, negate, value);
    }
}

export class LikeCondition extends AtomicCondition {
    constructor(public selector: string, public negate: boolean, public value: string) {
        super(selector, negate, value);
    }
}
