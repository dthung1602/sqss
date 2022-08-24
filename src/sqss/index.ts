import Transverser from "../transverser";
import * as ast from "./ast";
import { SqssNode } from "./ast";
import Lexer from "./lexer";
import Parser from "./parser";
import SemanticAnalyzer, { SAContext } from "./semantic-analyzer ";
import * as token from "./token";
import TokenStream from "./token-stream";

export { ast, Lexer, Parser, SAContext, SemanticAnalyzer, token, TokenStream };

export function tokenize(sqss: string): TokenStream {
    return new TokenStream(new Lexer(sqss));
}

export function parse(tokenStream: TokenStream): ast.SqssNode {
    return new Parser(tokenStream).parse();
}

export function analyze(sqssNode: SqssNode) {
    const semanticAnalyzer = new SemanticAnalyzer();
    new Transverser<SqssNode, void, SAContext>(SqssNode, sqssNode, semanticAnalyzer).transverse({});
}

export function toAST(sqss: string): ast.SqssNode {
    const root = parse(tokenize(sqss));
    analyze(root);
    return root;
}
