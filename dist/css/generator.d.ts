import { Agg, CSSVisitor } from "../visitor";
import { AllSelector, AndSelector, AttributeSelector, ChildSelector, ClassSelector, CSSNode, CSSStyleSheet, DescendantSelector, ElementSelector, FirstChild, IdSelector, ImmediatePrecedeSelector, LastChild, NotSelector, NthChild, NthLastChild, OrSelector, PrecedeSelector, PseudoClassSelector, PseudoElementSelector, StyleDeclaration, StyleRule } from "./ast";
declare type GAgg<N> = Agg<N, CSSNode, string>;
export default class Generator implements CSSVisitor<string, void> {
    postVisitCSSStyleSheet(node: CSSStyleSheet, context: void, data: GAgg<CSSStyleSheet>): string;
    postVisitStyleRule(node: StyleRule, context: void, data: GAgg<StyleRule>): string;
    postVisitStyleDeclaration(node: StyleDeclaration, context: void, data: Agg<StyleDeclaration, CSSNode, string>): string;
    postVisitAndSelector(node: AndSelector, context: void, data: GAgg<AndSelector>): string;
    private static selectorOrder;
    postVisitOrSelector(node: OrSelector, context: void, data: GAgg<OrSelector>): string;
    postVisitElementSelector(node: ElementSelector, context: void, data: GAgg<ElementSelector>): string;
    postVisitIdSelector(node: IdSelector, context: void, data: GAgg<IdSelector>): string;
    postVisitClassSelector(node: ClassSelector, context: void, data: GAgg<ClassSelector>): string;
    postVisitAttributeSelector(node: AttributeSelector, context: void, data: GAgg<AttributeSelector>): string;
    postVisitPseudoClassSelector(node: PseudoClassSelector, context: void, data: GAgg<PseudoClassSelector>): string;
    postVisitPseudoElementSelector(node: PseudoElementSelector, context: void, data: GAgg<PseudoElementSelector>): string;
    postVisitNotSelector(node: NotSelector, context: void, data: GAgg<NotSelector>): string;
    postVisitAllSelector(node: AllSelector, context: void, data: GAgg<AllSelector>): string;
    postVisitFirstChild(node: AllSelector, context: void, data: GAgg<FirstChild>): string;
    postVisitLastChild(node: AllSelector, context: void, data: GAgg<LastChild>): string;
    postVisitNthChild(node: NthChild, context: void, data: GAgg<NthChild>): string;
    postVisitNthLastChild(node: NthLastChild, context: void, data: GAgg<NthLastChild>): string;
    postVisitDescendantSelector(node: DescendantSelector, context: void, data: GAgg<DescendantSelector>): string;
    postVisitChildSelector(node: ChildSelector, context: void, data: GAgg<ChildSelector>): string;
    postVisitImmediatePrecedeSelector(node: ImmediatePrecedeSelector, context: void, data: GAgg<ImmediatePrecedeSelector>): string;
    postVisitPrecedeSelector(node: PrecedeSelector, context: void, data: GAgg<PrecedeSelector>): string;
}
export {};
