export type Value = string | boolean | null;

export class Root {
    constructor(public updateStatement: UpdateStatement) {}
}

export class UpdateStatement {
    constructor(public table: string, public styles: StyleStatement[], public where: WhereStatement) {}
}

export class StyleStatement {
    constructor(public field: string, public value: Value) {}
}

export class WhereStatement {
    constructor(public condition: Condition | null) {}
}

export type Condition = AtomicCondition | AndCondition | OrCondition;

export class AndCondition {
    constructor(public conditions: Condition[]) {}
}

export class OrCondition {
    constructor(public conditions: Condition[]) {}
}

export class AtomicCondition {
    constructor(public selector: string, public operator: string, public negate: boolean, public value: Value) {}
}
