"use strict";
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
Object.defineProperty(exports, "__esModule", { value: true });
const ast_1 = require("./ast");
class Generator {
    postVisitCSSStyleSheet(node, context, data) {
        return data.rules.join("\n\n");
    }
    postVisitStyleRule(node, context, data) {
        const styles = data.styles.join(`;\n    `);
        return `${data.selector} {\n    ${styles};\n}`;
    }
    postVisitStyleDeclaration(node, context, data) {
        return `${node.property}: ${node.value}`;
    }
    postVisitAndSelector(node, context, data) {
        const cssWithTypes = node.selectors.map((sel, i) => ({
            type: sel.constructor,
            css: data.selectors[i],
        }));
        cssWithTypes.sort(Generator.selectorOrder);
        return cssWithTypes.map((x) => x.css).join("");
    }
    static selectorOrder(a, b) {
        const order = [
            ast_1.AllSelector,
            ast_1.ElementSelector,
            ast_1.IdSelector,
            ast_1.ClassSelector,
            ast_1.PseudoClassSelector,
            ast_1.FirstChild,
            ast_1.LastChild,
            ast_1.NthChild,
            ast_1.NthLastChild,
            ast_1.AttributeSelector,
            ast_1.NotSelector,
            ast_1.PseudoElementSelector,
        ];
        return order.indexOf(a.type) - order.indexOf(b.type);
    }
    postVisitOrSelector(node, context, data) {
        const MAX_LINE_LENGTH = 120;
        let result = data.selectors.join(", ");
        if (result.length > MAX_LINE_LENGTH) {
            result = data.selectors.join(",\n");
        }
        return result;
    }
    postVisitElementSelector(node, context, data) {
        return node.value;
    }
    postVisitIdSelector(node, context, data) {
        return `#${node.value}`;
    }
    postVisitClassSelector(node, context, data) {
        return `.${node.value}`;
    }
    postVisitAttributeSelector(node, context, data) {
        const value = node.value === "" ? "" : `"${node.value}"`;
        return `[${node.attribute}${node.operator}${value}]`;
    }
    postVisitPseudoClassSelector(node, context, data) {
        // TODO remove true false value from pseudo class & element
        return node.value ? `:${node.klass}` : `:not(:${node.klass})`;
    }
    postVisitPseudoElementSelector(node, context, data) {
        return `::${node.element}`;
    }
    postVisitNotSelector(node, context, data) {
        return `:not(${data.selector})`;
    }
    postVisitAllSelector(node, context, data) {
        return "*";
    }
    postVisitFirstChild(node, context, data) {
        return ":first-child";
    }
    postVisitLastChild(node, context, data) {
        return ":last-child";
    }
    postVisitNthChild(node, context, data) {
        return `:nth-child(${node.n})`;
    }
    postVisitNthLastChild(node, context, data) {
        return `:nth-last-child(${node.n})`;
    }
    postVisitDescendantSelector(node, context, data) {
        return `${data.ancestor} ${data.descendant}`;
    }
    postVisitChildSelector(node, context, data) {
        return `${data.parent} > ${data.child}`;
    }
    postVisitImmediatePrecedeSelector(node, context, data) {
        return `${data.before} + ${data.after}`;
    }
    postVisitPrecedeSelector(node, context, data) {
        return `${data.before} ~ ${data.after}`;
    }
}
exports.default = Generator;
//# sourceMappingURL=generator.js.map