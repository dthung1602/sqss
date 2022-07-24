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
    public selector: string | null;
    public value: string | null;

    constructor(selector?: string, value?: string) {
        this.selector = selector === undefined ? null : selector;
        this.value = value === undefined ? null : value;
    }
}
