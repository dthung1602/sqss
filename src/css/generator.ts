/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Agg, CSSVisitor } from "../visitor";
import {
    AllSelector,
    AndSelector,
    AtomicSelector,
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

type GAgg<N> = Agg<N, CSSNode, string>;
type AtomicSelectorConstructor = { new (...args: any[]): AtomicSelector };
type CSSStrWithType = {
    type: AtomicSelectorConstructor;
    css: string;
};

export default class Generator implements CSSVisitor<string, void> {
    postVisitCSSStyleSheet(node: CSSStyleSheet, context: void, data: GAgg<CSSStyleSheet>): string {
        return data.rules.join("\n\n");
    }

    postVisitStyleRule(node: StyleRule, context: void, data: GAgg<StyleRule>): string {
        const styles = data.styles.join(`;\n    `);
        return `${data.selector} {\n    ${styles};\n}`;
    }

    postVisitStyleDeclaration(
        node: StyleDeclaration,
        context: void,
        data: Agg<StyleDeclaration, CSSNode, string>,
    ): string {
        return `${node.property}: ${node.value}`;
    }

    postVisitAndSelector(node: AndSelector, context: void, data: GAgg<AndSelector>): string {
        const cssWithTypes: CSSStrWithType[] = node.selectors.map((sel, i) => ({
            type: sel.constructor as AtomicSelectorConstructor,
            css: data.selectors[i],
        }));
        cssWithTypes.sort(Generator.selectorOrder);
        return cssWithTypes.map((x) => x.css).join("");
    }

    private static selectorOrder(a: CSSStrWithType, b: CSSStrWithType): number {
        const order = [
            AllSelector,
            ElementSelector,
            IdSelector,
            ClassSelector,
            PseudoClassSelector,
            FirstChild,
            LastChild,
            NthChild,
            NthLastChild,
            AttributeSelector,
            NotSelector,
            PseudoElementSelector,
        ];
        return order.indexOf(a.type) - order.indexOf(b.type);
    }

    postVisitOrSelector(node: OrSelector, context: void, data: GAgg<OrSelector>): string {
        const MAX_LINE_LENGTH = 120;
        let result = data.selectors.join(", ");
        if (result.length > MAX_LINE_LENGTH) {
            result = data.selectors.join(",\n");
        }
        return result;
    }

    postVisitElementSelector(node: ElementSelector, context: void, data: GAgg<ElementSelector>): string {
        return node.value;
    }

    postVisitIdSelector(node: IdSelector, context: void, data: GAgg<IdSelector>): string {
        return `#${node.value}`;
    }

    postVisitClassSelector(node: ClassSelector, context: void, data: GAgg<ClassSelector>): string {
        return `.${node.value}`;
    }

    postVisitAttributeSelector(node: AttributeSelector, context: void, data: GAgg<AttributeSelector>): string {
        const value = node.value === "" ? "" : `"${node.value}"`;
        return `[${node.attribute}${node.operator}${value}]`;
    }

    postVisitPseudoClassSelector(node: PseudoClassSelector, context: void, data: GAgg<PseudoClassSelector>): string {
        // TODO remove true false value from pseudo class & element
        return node.value ? `:${node.klass}` : `:not(:${node.klass})`;
    }

    postVisitPseudoElementSelector(
        node: PseudoElementSelector,
        context: void,
        data: GAgg<PseudoElementSelector>,
    ): string {
        return `::${node.element}`;
    }

    postVisitNotSelector(node: NotSelector, context: void, data: GAgg<NotSelector>): string {
        return `:not(${data.selector})`;
    }

    postVisitAllSelector(node: AllSelector, context: void, data: GAgg<AllSelector>): string {
        return "*";
    }

    postVisitFirstChild(node: AllSelector, context: void, data: GAgg<FirstChild>): string {
        return ":first-child";
    }

    postVisitLastChild(node: AllSelector, context: void, data: GAgg<LastChild>): string {
        return ":last-child";
    }

    postVisitNthChild(node: NthChild, context: void, data: GAgg<NthChild>): string {
        return `:nth-child(${node.n})`;
    }

    postVisitNthLastChild(node: NthLastChild, context: void, data: GAgg<NthLastChild>): string {
        return `:nth-last-child(${node.n})`;
    }

    postVisitDescendantSelector(node: DescendantSelector, context: void, data: GAgg<DescendantSelector>): string {
        return `${data.ancestor} ${data.descendant}`;
    }

    postVisitChildSelector(node: ChildSelector, context: void, data: GAgg<ChildSelector>): string {
        return `${data.parent} > ${data.child}`;
    }

    postVisitImmediatePrecedeSelector(
        node: ImmediatePrecedeSelector,
        context: void,
        data: GAgg<ImmediatePrecedeSelector>,
    ): string {
        return `${data.before} + ${data.after}`;
    }

    postVisitPrecedeSelector(node: PrecedeSelector, context: void, data: GAgg<PrecedeSelector>): string {
        return `${data.before} ~ ${data.after}`;
    }
}
