"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrecedeSelector = exports.ImmediatePrecedeSelector = exports.ChildSelector = exports.DescendantSelector = exports.NthLastChild = exports.NthChild = exports.LastChild = exports.FirstChild = exports.AllSelector = exports.NotSelector = exports.PseudoElementSelector = exports.PseudoClassSelector = exports.AttributeSelector = exports.ClassSelector = exports.IdSelector = exports.ElementSelector = exports.AtomicSelector = exports.OrSelector = exports.AndSelector = exports.NoOp = exports.Selector = exports.StyleDeclaration = exports.StyleRule = exports.CSSStyleSheet = exports.CSSNode = void 0;
// FIXME why abstract not work
class CSSNode {
}
exports.CSSNode = CSSNode;
class CSSStyleSheet extends CSSNode {
    constructor(rules) {
        super();
        this.rules = rules;
    }
}
exports.CSSStyleSheet = CSSStyleSheet;
class StyleRule extends CSSNode {
    constructor(selector, styles) {
        super();
        this.selector = selector;
        this.styles = styles;
    }
}
exports.StyleRule = StyleRule;
class StyleDeclaration extends CSSNode {
    constructor(property, value) {
        super();
        this.property = property;
        this.value = value;
    }
}
exports.StyleDeclaration = StyleDeclaration;
class Selector extends CSSNode {
}
exports.Selector = Selector;
// Just a placeholder
class NoOp extends Selector {
}
exports.NoOp = NoOp;
class AndSelector extends Selector {
    constructor(selectors) {
        super();
        this.selectors = selectors;
    }
}
exports.AndSelector = AndSelector;
class OrSelector extends Selector {
    constructor(selectors) {
        super();
        this.selectors = selectors;
    }
}
exports.OrSelector = OrSelector;
class AtomicSelector extends Selector {
    constructor(group) {
        super();
        this.group = group;
    }
}
exports.AtomicSelector = AtomicSelector;
class ElementSelector extends AtomicSelector {
    constructor(value, group) {
        super(group);
        this.value = value;
        this.group = group;
    }
}
exports.ElementSelector = ElementSelector;
class IdSelector extends AtomicSelector {
    constructor(value, group) {
        super(group);
        this.value = value;
        this.group = group;
    }
}
exports.IdSelector = IdSelector;
class ClassSelector extends AtomicSelector {
    constructor(value, group) {
        super(group);
        this.value = value;
        this.group = group;
    }
}
exports.ClassSelector = ClassSelector;
class AttributeSelector extends AtomicSelector {
    constructor(attribute, operator, value, group) {
        super(group);
        this.attribute = attribute;
        this.operator = operator;
        this.value = value;
        this.group = group;
    }
}
exports.AttributeSelector = AttributeSelector;
class PseudoClassSelector extends AtomicSelector {
    constructor(klass, value, group) {
        super(group);
        this.klass = klass;
        this.value = value;
        this.group = group;
    }
}
exports.PseudoClassSelector = PseudoClassSelector;
class PseudoElementSelector extends AtomicSelector {
    constructor(element, value, group) {
        super(group);
        this.element = element;
        this.value = value;
        this.group = group;
    }
}
exports.PseudoElementSelector = PseudoElementSelector;
class NotSelector extends AtomicSelector {
    constructor(selector) {
        super(selector.group);
        this.selector = selector;
    }
}
exports.NotSelector = NotSelector;
class AllSelector extends AtomicSelector {
}
exports.AllSelector = AllSelector;
class FirstChild extends AtomicSelector {
}
exports.FirstChild = FirstChild;
class LastChild extends AtomicSelector {
}
exports.LastChild = LastChild;
class NthChild extends AtomicSelector {
    constructor(n, group) {
        super(group);
        this.n = n;
        this.group = group;
    }
}
exports.NthChild = NthChild;
class NthLastChild extends AtomicSelector {
    constructor(n, group) {
        super(group);
        this.n = n;
        this.group = group;
    }
}
exports.NthLastChild = NthLastChild;
class DescendantSelector extends Selector {
    constructor(ancestor, descendant) {
        super();
        this.ancestor = ancestor;
        this.descendant = descendant;
    }
}
exports.DescendantSelector = DescendantSelector;
class ChildSelector extends Selector {
    constructor(parent, child) {
        super();
        this.parent = parent;
        this.child = child;
    }
}
exports.ChildSelector = ChildSelector;
class ImmediatePrecedeSelector extends Selector {
    constructor(before, after) {
        super();
        this.before = before;
        this.after = after;
    }
}
exports.ImmediatePrecedeSelector = ImmediatePrecedeSelector;
class PrecedeSelector extends Selector {
    constructor(before, after) {
        super();
        this.before = before;
        this.after = after;
    }
}
exports.PrecedeSelector = PrecedeSelector;
//# sourceMappingURL=ast.js.map