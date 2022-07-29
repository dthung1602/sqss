/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Agg, CSSVisitor } from "../visitor";
import {
    AllSelector,
    AndSelector,
    AttributeSelector,
    ClassSelector,
    CSSNode,
    CSSStyleSheet,
    ElementSelector,
    IdSelector,
    NotSelector,
    OrSelector,
    PseudoClassSelector,
    PseudoElementSelector,
    StyleDeclaration,
    StyleRule,
} from "./ast";

type GAgg<N> = Agg<N, CSSNode, string>;

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
        return `${node.property} = ${node.value}`;
    }

    postVisitAndSelector(node: AndSelector, context: void, data: GAgg<AndSelector>): string {
        // TODO sort
        return data.selectors.join("");
    }

    postVisitOrSelector(node: OrSelector, context: void, data: GAgg<OrSelector>): string {
        return data.selectors.join(", ");
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
        return `[${node.attribute}${node.operator}${node.value}]`;
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
        return node.value ? `::${node.element}` : "";
    }

    postVisitNotSelector(node: NotSelector, context: void, data: GAgg<NotSelector>): string {
        return `:not(${data.selector})`;
    }

    postVisitAllSelector(node: AllSelector, context: void, data: GAgg<AllSelector>): string {
        return "*";
    }
}
