type CSSValue = string | boolean;

export abstract class CSSNode {}

export class CSSStyleSheet extends CSSNode {
    constructor(public rules: StyleRule[]) {
        super();
    }
}

export class StyleRule extends CSSNode {
    constructor(public selectors: CombinedSelector[], public styles: StyleDeclaration[]) {
        super();
    }
}

export class StyleDeclaration extends CSSNode {
    constructor(public property: string, public value: CSSValue) {
        super();
    }
}

export class CombinedSelector extends CSSNode {
    constructor(public selectors: AtomicSelector[]) {
        super();
    }
}

export abstract class AtomicSelector extends CSSNode {}

export class ElementSelector extends AtomicSelector {
    constructor(public value: string) {
        super();
    }
}

export class IdSelector extends AtomicSelector {
    constructor(public value: string) {
        super();
    }
}

export class ClassSelector extends AtomicSelector {
    constructor(public value: string) {
        super();
    }
}

export type AttributeOperator = "" | "=" | "^=" | "$=" | "*=";

export class AttributeSelector extends AtomicSelector {
    constructor(public attribute: string, public operator: AttributeOperator, public value: string) {
        super();
    }
}

export class PseudoClassSelector extends AtomicSelector {
    constructor(public value: string) {
        super();
    }
}

export class PseudoElementSelector extends AtomicSelector {
    constructor(public value: string) {
        super();
    }
}

export class NotSelector extends AtomicSelector {
    constructor(public selector: CombinedSelector) {
        super();
    }
}

export class AllSelector extends AtomicSelector {}
