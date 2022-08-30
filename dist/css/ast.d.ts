declare type CSSValue = string | boolean;
export declare class CSSNode {
}
export declare class CSSStyleSheet extends CSSNode {
    rules: StyleRule[];
    constructor(rules: StyleRule[]);
}
export declare class StyleRule extends CSSNode {
    selector: Selector;
    styles: StyleDeclaration[];
    constructor(selector: Selector, styles: StyleDeclaration[]);
}
export declare class StyleDeclaration extends CSSNode {
    property: string;
    value: CSSValue;
    constructor(property: string, value: CSSValue);
}
export declare abstract class Selector extends CSSNode {
}
export declare class NoOp extends Selector {
}
export declare class AndSelector extends Selector {
    selectors: AtomicSelector[];
    constructor(selectors: AtomicSelector[]);
}
export declare class OrSelector extends Selector {
    selectors: (AJSelector | JoinSelector)[];
    constructor(selectors: (AJSelector | JoinSelector)[]);
}
export declare abstract class AtomicSelector extends Selector {
    group: string;
    constructor(group: string);
}
export declare class ElementSelector extends AtomicSelector {
    value: string;
    group: string;
    constructor(value: string, group: string);
}
export declare class IdSelector extends AtomicSelector {
    value: string;
    group: string;
    constructor(value: string, group: string);
}
export declare class ClassSelector extends AtomicSelector {
    value: string;
    group: string;
    constructor(value: string, group: string);
}
export declare type AttributeOperator = "" | "=" | "^=" | "$=" | "*=";
export declare class AttributeSelector extends AtomicSelector {
    attribute: string;
    operator: AttributeOperator;
    value: string;
    group: string;
    constructor(attribute: string, operator: AttributeOperator, value: string, group: string);
}
export declare class PseudoClassSelector extends AtomicSelector {
    klass: string;
    value: boolean;
    group: string;
    constructor(klass: string, value: boolean, group: string);
}
export declare class PseudoElementSelector extends AtomicSelector {
    element: string;
    value: boolean;
    group: string;
    constructor(element: string, value: boolean, group: string);
}
export declare class NotSelector extends AtomicSelector {
    selector: AtomicSelector;
    constructor(selector: AtomicSelector);
}
export declare class AllSelector extends AtomicSelector {
}
export declare class FirstChild extends AtomicSelector {
}
export declare class LastChild extends AtomicSelector {
}
export declare class NthChild extends AtomicSelector {
    n: number;
    group: string;
    constructor(n: number, group: string);
}
export declare class NthLastChild extends AtomicSelector {
    n: number;
    group: string;
    constructor(n: number, group: string);
}
export declare type AJSelector = AtomicSelector | AndSelector | JoinSelector;
export declare class DescendantSelector extends Selector {
    ancestor: AJSelector;
    descendant: AJSelector;
    constructor(ancestor: AJSelector, descendant: AJSelector);
}
export declare class ChildSelector extends Selector {
    parent: AJSelector;
    child: AJSelector;
    constructor(parent: AJSelector, child: AJSelector);
}
export declare class ImmediatePrecedeSelector extends Selector {
    before: AJSelector;
    after: AJSelector;
    constructor(before: AJSelector, after: AJSelector);
}
export declare class PrecedeSelector extends Selector {
    before: AJSelector;
    after: AJSelector;
    constructor(before: AJSelector, after: AJSelector);
}
export declare type JoinSelector = DescendantSelector | ChildSelector | ImmediatePrecedeSelector | PrecedeSelector;
export {};
