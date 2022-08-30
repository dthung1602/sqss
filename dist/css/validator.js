"use strict";
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const ast_1 = require("./ast");
class Validator {
    postVisitCSSStyleSheet(node, context, data) { }
    postVisitStyleRule(node, context, data) { }
    postVisitStyleDeclaration(node, context, data) {
        node.property = node.property.trim();
        if (!(0, utils_1.isKebabCase)(node.property)) {
            throw new Error(`CSS property must have kebab-case, got "${node.property}"`);
        }
    }
    postVisitAndSelector(node, context, data) {
        for (const cls of [ast_1.ElementSelector, ast_1.IdSelector]) {
            const s = node.selectors.filter((s) => s instanceof cls);
            if (s.length > 1) {
                throw new Error(`More than one selector of ${cls.name} combined is not valid`);
            }
        }
    }
    postVisitOrSelector(node, context, data) { }
    postVisitElementSelector(node, context, data) {
        node.value = node.value.trim().toLowerCase();
        if ((0, utils_1.startsWith)(node.value, "1234567890_-".split(""))) {
            throw new Error(`Element "${node.value}" starts with invalid characters`);
        }
    }
    postVisitIdSelector(node, context, data) {
        node.value = node.value.trim();
        if (node.value.includes(" ")) {
            throw new Error(`Id "${node.value}" contains invalid character " "`);
        }
    }
    postVisitClassSelector(node, context, data) {
        node.value = node.value.trim();
        if (node.value.includes(" ")) {
            throw new Error(`Class name "${node.value}" contains invalid character " "`);
        }
    }
    postVisitAttributeSelector(node, context, data) {
        const attr = node.attribute.trim().toLowerCase();
        if (attr.length === 0) {
            throw new Error(`Empty HTML attribute ${attr}`);
        }
        const ch = (0, utils_1.containAnyStr)(attr, ['"', "'", ">", "/", "="]);
        if (ch) {
            throw new Error(`Attribute name "${attr}" contains invalid character "${ch}"`);
        }
        node.attribute = attr;
    }
    postVisitPseudoClassSelector(node, context, data) {
        node.klass = node.klass.trim();
        (0, utils_1.assertTrue)(PSEUDO_CLASS.includes(node.klass), `Invalid pseudo class ${node.klass}`);
    }
    postVisitPseudoElementSelector(node, context, data) {
        node.element = node.element.trim();
        (0, utils_1.assertTrue)(PSEUDO_ELEMENTS.includes(node.element), `Invalid pseudo class ${node.element}`);
    }
    postVisitNotSelector(node, context, data) { }
    postVisitAllSelector(node, context, data) { }
    postVisitFirstChild(node, context, data) { }
    postVisitLastChild(node, context, data) { }
    postVisitNthChild(node, context, data) { }
    postVisitNthLastChild(node, context, data) { }
    postVisitDescendantSelector(node, context, data) { }
    postVisitChildSelector(node, context, data) { }
    postVisitImmediatePrecedeSelector(node, context, data) { }
    postVisitPrecedeSelector(node, context, data) { }
}
exports.default = Validator;
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
//# sourceMappingURL=validator.js.map