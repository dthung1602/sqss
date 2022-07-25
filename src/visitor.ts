import {
    AllSelector,
    AttributeSelector,
    ClassSelector,
    CombinedSelector,
    CSSNode,
    CSSStyleSheet,
    ElementSelector,
    IdSelector,
    NotSelector,
    PseudoClassSelector,
    PseudoElementSelector,
    StyleDeclaration,
    StyleRule,
} from "./css/ast";
import {
    AndCondition,
    EqualCondition,
    IsCondition,
    LikeCondition,
    OrCondition,
    SqssNode,
    SqssStyleSheet,
    StyleAssignment,
    UpdateStatement,
} from "./sql/ast";

export type Agg<Node, BaseNode, Val> = {
    [Key in keyof Node]: Node[Key] extends (infer N)[]
        ? N extends BaseNode
            ? Val[]
            : never
        : Node[Key] extends BaseNode
        ? Val
        : never;
};

type PreStr<T> = T extends string ? (string extends T ? never : `preVisit${T}`) : never;
type PostStr<T> = T extends string ? (string extends T ? never : `postVisit${T}`) : never;
type PrePostStr<T> = PreStr<T> | PostStr<T>;
type PreFunc<Node, Ctx> = (node: Node, context: Ctx) => Ctx;
type PostFunc<Node, BaseNode, Ctx, Val> = (node: Node, context: Ctx, data: Agg<Node, BaseNode, Val>) => Val;
type PrePostFunc<P, Name, Node, BaseNode, Val, Ctx> = P extends PreStr<Name>
    ? PreFunc<Node, Ctx>
    : PostFunc<Node, BaseNode, Ctx, Val>;
type PrePostHook<Name extends string, Node, BaseNode, Val, Ctx> = {
    [P in PrePostStr<Name>]?: PrePostFunc<P, Name, Node, BaseNode, Val, Ctx>;
};

export type SQSSVisitor<Val, Ctx> = PrePostHook<"AndCondition", AndCondition, SqssNode, Val, Ctx> &
    PrePostHook<"EqualCondition", EqualCondition, SqssNode, Val, Ctx> &
    PrePostHook<"IsCondition", IsCondition, SqssNode, Val, Ctx> &
    PrePostHook<"LikeCondition", LikeCondition, SqssNode, Val, Ctx> &
    PrePostHook<"OrCondition", OrCondition, SqssNode, Val, Ctx> &
    PrePostHook<"SqssStyleSheet", SqssStyleSheet, SqssNode, Val, Ctx> &
    PrePostHook<"StyleAssignment", StyleAssignment, SqssNode, Val, Ctx> &
    PrePostHook<"UpdateStatement", UpdateStatement, SqssNode, Val, Ctx>;

export type CSSVisitor<Val, Ctx> = PrePostHook<"CSSStyleSheet", CSSStyleSheet, CSSNode, Val, Ctx> &
    PrePostHook<"StyleRule", StyleRule, CSSNode, Val, Ctx> &
    PrePostHook<"StyleDeclaration", StyleDeclaration, CSSNode, Val, Ctx> &
    PrePostHook<"CombinedSelector", CombinedSelector, CSSNode, Val, Ctx> &
    PrePostHook<"ElementSelector", ElementSelector, CSSNode, Val, Ctx> &
    PrePostHook<"IdSelector", IdSelector, CSSNode, Val, Ctx> &
    PrePostHook<"ClassSelector", ClassSelector, CSSNode, Val, Ctx> &
    PrePostHook<"AttributeSelector", AttributeSelector, CSSNode, Val, Ctx> &
    PrePostHook<"PseudoClassSelector", PseudoClassSelector, CSSNode, Val, Ctx> &
    PrePostHook<"PseudoElementSelector", PseudoElementSelector, CSSNode, Val, Ctx> &
    PrePostHook<"NotSelector", NotSelector, CSSNode, Val, Ctx> &
    PrePostHook<"AllSelector", AllSelector, CSSNode, Val, Ctx>;

export type Visitor<Val, Ctx> = SQSSVisitor<Val, Ctx> | CSSVisitor<Val, Ctx>;
