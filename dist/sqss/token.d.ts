export declare class TokenUpdate {
    static readonly value = "UPDATE";
}
export declare class TokenSet {
    static readonly value = "SET";
}
export declare class TokenWhere {
    static readonly value = "WHERE";
}
export declare class TokenJoin {
    static readonly value = "JOIN";
}
export declare class TokenAs {
    static readonly value = "AS";
}
export declare class TokenOn {
    static readonly value = "ON";
}
export declare class TokenSemiColon {
    static readonly value = ";";
}
export declare class TokenComma {
    static readonly value = ",";
}
export declare class TokenOpenParenthesis {
    static readonly value = "(";
}
export declare class TokenCloseParenthesis {
    static readonly value = ")";
}
export declare class TokenNot {
    static readonly value = "NOT";
}
export declare class TokenEqual {
    static readonly value = "=";
}
export declare class TokenNotEqual {
    static readonly value = "!=";
}
export declare class TokenLike {
    static readonly value = "LIKE";
}
export declare class TokenIs {
    static readonly value = "IS";
}
export declare class TokenAnd {
    static readonly value = "AND";
}
export declare class TokenOr {
    static readonly value = "OR";
}
export declare class TokenIdentifier {
    static readonly regex: RegExp;
    readonly raw: string;
    readonly value: string;
    constructor(value: string);
}
export declare class TokenString {
    static readonly regex: RegExp;
    readonly raw: string;
    readonly value: string;
    constructor(value: string);
}
export declare class TokenNull {
    static readonly value = "NULL";
}
export declare class TokenTrue {
    static readonly value = "TRUE";
}
export declare class TokenFalse {
    static readonly value = "FALSE";
}
export declare class TokenNumber {
    static readonly regex: RegExp;
    readonly raw: string;
    readonly value: number;
    constructor(value: string);
}
export declare class TokenComment {
    static readonly regex: RegExp;
    readonly raw: string;
    readonly value: string;
    constructor(value: string);
}
export declare type TokenKeyword = TokenUpdate | TokenSet | TokenWhere | TokenJoin | TokenAs | TokenOn;
export declare type TokenSpecialChar = TokenSemiColon | TokenComma | TokenOpenParenthesis | TokenCloseParenthesis;
export declare type TokenOperator = TokenEqual | TokenNotEqual | TokenIs | TokenNot | TokenLike | TokenAnd | TokenOr;
export declare type TokenValue = TokenString | TokenNull | TokenTrue | TokenFalse | TokenNumber;
export declare type Token = TokenKeyword | TokenSpecialChar | TokenOperator | TokenIdentifier | TokenValue | TokenComment;
export declare type TokenClass = {
    new (...args: any[]): Token;
};
