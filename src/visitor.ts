import {
    AllSelector,
    AndSelector,
    AttributeSelector,
    ClassSelector,
    CSSNode,
    CSSStyleSheet,
    ElementSelector,
    FirstChild,
    IdSelector,
    LastChild,
    NotSelector,
    NthChild,
    NthLastChild,
    OrSelector,
    PseudoClassSelector,
    PseudoElementSelector,
    StyleDeclaration,
    StyleRule,
} from "./css/ast";
import {
    AndExpression,
    EqualExpression,
    FuncCallExpression,
    IsExpression,
    LikeExpression,
    OrExpression,
    SqssNode,
    SqssStyleSheet,
    StyleAssignment,
    UpdateStatement,
} from "./sqss/ast";

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

export type SQSSVisitor<Val, Ctx> = PrePostHook<"AndExpression", AndExpression, SqssNode, Val, Ctx> &
    PrePostHook<"EqualExpression", EqualExpression, SqssNode, Val, Ctx> &
    PrePostHook<"FuncCallExpression", FuncCallExpression, SqssNode, Val, Ctx> &
    PrePostHook<"IsExpression", IsExpression, SqssNode, Val, Ctx> &
    PrePostHook<"LikeExpression", LikeExpression, SqssNode, Val, Ctx> &
    PrePostHook<"OrExpression", OrExpression, SqssNode, Val, Ctx> &
    PrePostHook<"SqssStyleSheet", SqssStyleSheet, SqssNode, Val, Ctx> &
    PrePostHook<"StyleAssignment", StyleAssignment, SqssNode, Val, Ctx> &
    PrePostHook<"UpdateStatement", UpdateStatement, SqssNode, Val, Ctx>;

export type CSSVisitor<Val, Ctx> = PrePostHook<"CSSStyleSheet", CSSStyleSheet, CSSNode, Val, Ctx> &
    PrePostHook<"StyleRule", StyleRule, CSSNode, Val, Ctx> &
    PrePostHook<"StyleDeclaration", StyleDeclaration, CSSNode, Val, Ctx> &
    PrePostHook<"AndSelector", AndSelector, CSSNode, Val, Ctx> &
    PrePostHook<"OrSelector", OrSelector, CSSNode, Val, Ctx> &
    PrePostHook<"ElementSelector", ElementSelector, CSSNode, Val, Ctx> &
    PrePostHook<"IdSelector", IdSelector, CSSNode, Val, Ctx> &
    PrePostHook<"ClassSelector", ClassSelector, CSSNode, Val, Ctx> &
    PrePostHook<"AttributeSelector", AttributeSelector, CSSNode, Val, Ctx> &
    PrePostHook<"PseudoClassSelector", PseudoClassSelector, CSSNode, Val, Ctx> &
    PrePostHook<"PseudoElementSelector", PseudoElementSelector, CSSNode, Val, Ctx> &
    PrePostHook<"NotSelector", NotSelector, CSSNode, Val, Ctx> &
    PrePostHook<"AllSelector", AllSelector, CSSNode, Val, Ctx> &
    PrePostHook<"FirstChild", FirstChild, CSSNode, Val, Ctx> &
    PrePostHook<"LastChild", LastChild, CSSNode, Val, Ctx> &
    PrePostHook<"NthChild", NthChild, CSSNode, Val, Ctx> &
    PrePostHook<"NthLastChild", NthLastChild, CSSNode, Val, Ctx>;

export type Visitor<Val, Ctx> = SQSSVisitor<Val, Ctx> | CSSVisitor<Val, Ctx>;
