import { Agg, CSSVisitor } from "../visitor";
import { AllSelector, AndSelector, AttributeSelector, ChildSelector, ClassSelector, CSSNode, CSSStyleSheet, DescendantSelector, ElementSelector, FirstChild, IdSelector, ImmediatePrecedeSelector, LastChild, NotSelector, NthChild, NthLastChild, OrSelector, PrecedeSelector, PseudoClassSelector, PseudoElementSelector, StyleDeclaration, StyleRule } from "./ast";
declare type VAgg<N> = Agg<N, CSSNode, void>;
export default class Validator implements CSSVisitor<void, void> {
    postVisitCSSStyleSheet(node: CSSStyleSheet, context: void, data: VAgg<CSSStyleSheet>): void;
    postVisitStyleRule(node: StyleRule, context: void, data: VAgg<StyleRule>): void;
    postVisitStyleDeclaration(node: StyleDeclaration, context: void, data: VAgg<StyleDeclaration>): void;
    postVisitAndSelector(node: AndSelector, context: void, data: VAgg<AndSelector>): void;
    postVisitOrSelector(node: OrSelector, context: void, data: VAgg<OrSelector>): void;
    postVisitElementSelector(node: ElementSelector, context: void, data: VAgg<ElementSelector>): void;
    postVisitIdSelector(node: IdSelector, context: void, data: VAgg<IdSelector>): void;
    postVisitClassSelector(node: ClassSelector, context: void, data: VAgg<ClassSelector>): void;
    postVisitAttributeSelector(node: AttributeSelector, context: void, data: VAgg<AttributeSelector>): void;
    postVisitPseudoClassSelector(node: PseudoClassSelector, context: void, data: VAgg<PseudoClassSelector>): void;
    postVisitPseudoElementSelector(node: PseudoElementSelector, context: void, data: VAgg<PseudoElementSelector>): void;
    postVisitNotSelector(node: NotSelector, context: void, data: VAgg<NotSelector>): void;
    postVisitAllSelector(node: AllSelector, context: void, data: VAgg<AllSelector>): void;
    postVisitFirstChild(node: AllSelector, context: void, data: VAgg<FirstChild>): void;
    postVisitLastChild(node: AllSelector, context: void, data: VAgg<LastChild>): void;
    postVisitNthChild(node: NthChild, context: void, data: VAgg<NthChild>): void;
    postVisitNthLastChild(node: NthLastChild, context: void, data: VAgg<NthLastChild>): void;
    postVisitDescendantSelector(node: DescendantSelector, context: void, data: VAgg<DescendantSelector>): void;
    postVisitChildSelector(node: ChildSelector, context: void, data: VAgg<ChildSelector>): void;
    postVisitImmediatePrecedeSelector(node: ImmediatePrecedeSelector, context: void, data: VAgg<ImmediatePrecedeSelector>): void;
    postVisitPrecedeSelector(node: PrecedeSelector, context: void, data: VAgg<PrecedeSelector>): void;
}
export {};
