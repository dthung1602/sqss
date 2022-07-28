type CSSValue = string | boolean;

// FIXME why abstract not work
export class CSSNode {}

export class CSSStyleSheet extends CSSNode {
    constructor(public rules: StyleRule[]) {
        super();
    }
}

export class StyleRule extends CSSNode {
    constructor(public selector: Selector, public styles: StyleDeclaration[]) {
        super();
    }
}

export class StyleDeclaration extends CSSNode {
    constructor(public property: string, public value: CSSValue) {
        super();
    }
}

export abstract class Selector extends CSSNode {}

export class AndSelector extends Selector {
    constructor(public selectors: AtomicSelector[]) {
        super();
    }
}

export class OrSelector extends Selector {
    constructor(public selectors: (AtomicSelector | AndSelector)[]) {
        super();
    }
}

export abstract class AtomicSelector extends Selector {}

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
    constructor(public klass: string, public value: boolean) {
        super();
    }
}

export class PseudoElementSelector extends AtomicSelector {
    constructor(public element: string, public value: boolean) {
        super();
    }
}

export class NotSelector extends AtomicSelector {
    constructor(public selector: AtomicSelector) {
        super();
    }
}

export class AllSelector extends AtomicSelector {}
