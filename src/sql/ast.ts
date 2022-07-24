export type Value = string | boolean | null;
export type Condition = AtomicCondition | AndCondition | OrCondition;
export type Node = SqssStyleSheet | UpdateStatement | StyleAssignment | Condition;

export class SqssStyleSheet {
    constructor(public updates: UpdateStatement[] = []) {}
}

export class UpdateStatement {
    constructor(public table: string, public assignments: StyleAssignment[], public where: Condition | null) {}
}

export class StyleAssignment {
    constructor(public property: string, public value: Value) {}
}

export class AndCondition {
    constructor(public conditions: Condition[]) {}
}

export class OrCondition {
    constructor(public conditions: Condition[]) {}
}

export class AtomicCondition {
    constructor(public selector: string, public operator: string, public negate: boolean, public value: Value) {}
}
