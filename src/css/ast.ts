type CSSValue = string | boolean;

export class CSSStyleSheet {
    constructor(public rules: StyleRule[]) {}
}

export class StyleRule {
    constructor(public selectors: CombinedSelector[], public styles: StyleDeclaration[]) {}
}

export class StyleDeclaration {
    constructor(public property: string, public value: CSSValue) {}
}

export class CombinedSelector {
    constructor(public selectors: AtomicSelector[]) {}
}

export type AtomicSelector =
    | ElementSelector
    | IdSelector
    | ClassSelector
    | AttributeSelector
    | PseudoClassSelector
    | PseudoElementSelector
    | NotSelector
    | AllSelector;

export class ElementSelector {
    constructor(public value: string) {}
}

export class IdSelector {
    constructor(public value: string) {}
}

export class ClassSelector {
    constructor(public value: string) {}
}

export type AttributeOperator = "" | "=" | "^=" | "$=" | "*=";

export class AttributeSelector {
    constructor(public attribute: string, public operator: AttributeOperator, public value: string) {}
}

export class PseudoClassSelector {
    constructor(public value: string) {}
}

export class PseudoElementSelector {
    constructor(public value: string) {}
}

export class NotSelector {
    constructor(public selector: CombinedSelector) {}
}

export class AllSelector {}
