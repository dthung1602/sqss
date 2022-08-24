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

// Just a placeholder
export class NoOp extends Selector {}

export class AndSelector extends Selector {
    constructor(public selectors: AtomicSelector[]) {
        super();
    }
}

export class OrSelector extends Selector {
    constructor(public selectors: (AJSelector | JoinSelector)[]) {
        super();
    }
}

export abstract class AtomicSelector extends Selector {
    constructor(public group: string) {
        super();
    }
}

export class ElementSelector extends AtomicSelector {
    constructor(public value: string, public group: string) {
        super(group);
    }
}

export class IdSelector extends AtomicSelector {
    constructor(public value: string, public group: string) {
        super(group);
    }
}

export class ClassSelector extends AtomicSelector {
    constructor(public value: string, public group: string) {
        super(group);
    }
}

export type AttributeOperator = "" | "=" | "^=" | "$=" | "*=";

export class AttributeSelector extends AtomicSelector {
    constructor(
        public attribute: string,
        public operator: AttributeOperator,
        public value: string,
        public group: string,
    ) {
        super(group);
    }
}

export class PseudoClassSelector extends AtomicSelector {
    constructor(public klass: string, public value: boolean, public group: string) {
        super(group);
    }
}

export class PseudoElementSelector extends AtomicSelector {
    constructor(public element: string, public value: boolean, public group: string) {
        super(group);
    }
}

export class NotSelector extends AtomicSelector {
    constructor(public selector: AtomicSelector) {
        super(selector.group);
    }
}

export class AllSelector extends AtomicSelector {}

export class FirstChild extends AtomicSelector {}

export class LastChild extends AtomicSelector {}

export class NthChild extends AtomicSelector {
    constructor(public n: number, public group: string) {
        super(group);
    }
}

export class NthLastChild extends AtomicSelector {
    constructor(public n: number, public group: string) {
        super(group);
    }
}

export type AJSelector = AtomicSelector | AndSelector | JoinSelector;

export class DescendantSelector extends Selector {
    constructor(public ancestor: AJSelector, public descendant: AJSelector) {
        super();
    }
}

export class ChildSelector extends Selector {
    constructor(public parent: AJSelector, public child: AJSelector) {
        super();
    }
}

export class ImmediatePrecedeSelector extends Selector {
    constructor(public before: AJSelector, public after: AJSelector) {
        super();
    }
}

export class PrecedeSelector extends Selector {
    constructor(public before: AJSelector, public after: AJSelector) {
        super();
    }
}

export type JoinSelector = DescendantSelector | ChildSelector | ImmediatePrecedeSelector | PrecedeSelector;
