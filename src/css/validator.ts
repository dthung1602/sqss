/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { FuncCallExpression } from "../sqss/ast";
import { assertTrue, containAnyStr, isKebabCase, startsWith } from "../utils";
import { Agg, CSSVisitor } from "../visitor";
import {
    AllSelector,
    AndSelector,
    AttributeSelector,
    ChildSelector,
    ClassSelector,
    CSSNode,
    CSSStyleSheet,
    DescendantSelector,
    ElementSelector,
    FirstChild,
    IdSelector,
    ImmediatePrecedeSelector,
    LastChild,
    NotSelector,
    NthChild,
    NthLastChild,
    OrSelector,
    PrecedeSelector,
    PseudoClassSelector,
    PseudoElementSelector,
    StyleDeclaration,
    StyleRule,
} from "./ast";

type VAgg<N> = Agg<N, CSSNode, void>;

export default class Validator implements CSSVisitor<void, void> {
    postVisitCSSStyleSheet(node: CSSStyleSheet, context: void, data: VAgg<CSSStyleSheet>) {}

    postVisitStyleRule(node: StyleRule, context: void, data: VAgg<StyleRule>) {}

    postVisitStyleDeclaration(node: StyleDeclaration, context: void, data: VAgg<StyleDeclaration>) {
        node.property = node.property.trim();
        if (!isKebabCase(node.property)) {
            throw new Error(`CSS property must have kebab-case, got "${node.property}"`);
        }
    }

    postVisitAndSelector(node: AndSelector, context: void, data: VAgg<AndSelector>) {
        for (const cls of [ElementSelector, IdSelector]) {
            const s = node.selectors.filter((s) => s instanceof cls);
            if (s.length > 1) {
                throw new Error(`More than one selector of ${cls.name} combined is not valid`);
            }
        }
    }

    postVisitOrSelector(node: OrSelector, context: void, data: VAgg<OrSelector>) {}

    postVisitElementSelector(node: ElementSelector, context: void, data: VAgg<ElementSelector>) {
        node.value = node.value.trim().toLowerCase();
        if (startsWith(node.value, "1234567890_-".split(""))) {
            throw new Error(`Element "${node.value}" starts with invalid characters`);
        }
    }

    postVisitIdSelector(node: IdSelector, context: void, data: VAgg<IdSelector>) {
        node.value = node.value.trim();
        if (node.value.includes(" ")) {
            throw new Error(`Id "${node.value}" contains invalid character " "`);
        }
    }

    postVisitClassSelector(node: ClassSelector, context: void, data: VAgg<ClassSelector>) {
        node.value = node.value.trim();
        if (node.value.includes(" ")) {
            throw new Error(`Class name "${node.value}" contains invalid character " "`);
        }
    }

    postVisitAttributeSelector(node: AttributeSelector, context: void, data: VAgg<AttributeSelector>) {
        const attr = node.attribute.trim().toLowerCase();
        if (attr.length === 0) {
            throw new Error(`Empty HTML attribute ${attr}`);
        }
        const ch = containAnyStr(attr, ['"', "'", ">", "/", "="]);
        if (ch) {
            throw new Error(`Attribute name "${attr}" contains invalid character "${ch}"`);
        }
        node.attribute = attr;
    }

    postVisitPseudoClassSelector(node: PseudoClassSelector, context: void, data: VAgg<PseudoClassSelector>) {
        node.klass = node.klass.trim();
        assertTrue(PSEUDO_CLASS.includes(node.klass), `Invalid pseudo class ${node.klass}`);
    }

    postVisitPseudoElementSelector(node: PseudoElementSelector, context: void, data: VAgg<PseudoElementSelector>) {
        node.element = node.element.trim();
        assertTrue(PSEUDO_ELEMENTS.includes(node.element), `Invalid pseudo class ${node.element}`);
    }

    postVisitNotSelector(node: NotSelector, context: void, data: VAgg<NotSelector>) {}

    postVisitAllSelector(node: AllSelector, context: void, data: VAgg<AllSelector>) {}

    postVisitFirstChild(node: AllSelector, context: void, data: VAgg<FirstChild>) {}

    postVisitLastChild(node: AllSelector, context: void, data: VAgg<LastChild>) {}

    postVisitNthChild(node: NthChild, context: void, data: VAgg<NthChild>) {}

    postVisitNthLastChild(node: NthLastChild, context: void, data: VAgg<NthLastChild>) {}

    postVisitDescendantSelector(node: DescendantSelector, context: void, data: VAgg<DescendantSelector>) {}

    postVisitChildSelector(node: ChildSelector, context: void, data: VAgg<ChildSelector>) {}

    postVisitImmediatePrecedeSelector(
        node: ImmediatePrecedeSelector,
        context: void,
        data: VAgg<ImmediatePrecedeSelector>,
    ) {}

    postVisitPrecedeSelector(node: PrecedeSelector, context: void, data: VAgg<PrecedeSelector>) {}
}

// from https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes
const PSEUDO_CLASS = [
    // TODO change from pseudo class to pseudo element
    "after",
    "before",
    //---
    "active",
    "any-link",
    "autofill",
    "blank",
    "checked",
    "current",
    "default",
    "defined",
    // "dir()",
    "disabled",
    "empty",
    "enabled",
    "first",
    "first-child",
    "first-of-type",
    "fullscreen",
    "future",
    "focus",
    "focus-visible",
    "focus-within",
    // "has()",
    "host",
    // "host()",
    // "host-context()",
    "hover",
    "indeterminate",
    "in-range",
    "invalid",
    // "is()",
    // "lang()",
    "last-child",
    "last-of-type",
    "left",
    "link",
    "local-link",
    // "not()",
    // "nth-child()",
    // "nth-col()",
    // "nth-last-child()",
    // "nth-last-col()",
    // "nth-last-of-type()",
    // "nth-of-type()",
    "only-child",
    "only-of-type",
    "optional",
    "out-of-range",
    "past",
    "picture-in-picture",
    "placeholder-shown",
    "paused",
    "playing",
    "read-only",
    "read-write",
    "required",
    "right",
    "root",
    "scope",
    // "state()",
    "target",
    "target-within",
    "user-invalid",
    "valid",
    "visited",
    // "where()",
];

// from https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements
const PSEUDO_ELEMENTS = [
    "after",
    "backdrop",
    "before",
    "cue",
    "cue-region",
    "first-letter",
    "first-line",
    "file-selector-button",
    "marker",
    "placeholder",
    "selection",
];
