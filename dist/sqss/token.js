"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenComment = exports.TokenNumber = exports.TokenFalse = exports.TokenTrue = exports.TokenNull = exports.TokenString = exports.TokenIdentifier = exports.TokenOr = exports.TokenAnd = exports.TokenIs = exports.TokenLike = exports.TokenNotEqual = exports.TokenEqual = exports.TokenNot = exports.TokenCloseParenthesis = exports.TokenOpenParenthesis = exports.TokenComma = exports.TokenSemiColon = exports.TokenOn = exports.TokenAs = exports.TokenJoin = exports.TokenWhere = exports.TokenSet = exports.TokenUpdate = void 0;
const utils_1 = require("../utils");
// Keywords
class TokenUpdate {
}
exports.TokenUpdate = TokenUpdate;
TokenUpdate.value = "UPDATE";
class TokenSet {
}
exports.TokenSet = TokenSet;
TokenSet.value = "SET";
class TokenWhere {
}
exports.TokenWhere = TokenWhere;
TokenWhere.value = "WHERE";
class TokenJoin {
}
exports.TokenJoin = TokenJoin;
TokenJoin.value = "JOIN";
class TokenAs {
}
exports.TokenAs = TokenAs;
TokenAs.value = "AS";
class TokenOn {
}
exports.TokenOn = TokenOn;
TokenOn.value = "ON";
// Special char
class TokenSemiColon {
}
exports.TokenSemiColon = TokenSemiColon;
TokenSemiColon.value = ";";
class TokenComma {
}
exports.TokenComma = TokenComma;
TokenComma.value = ",";
class TokenOpenParenthesis {
}
exports.TokenOpenParenthesis = TokenOpenParenthesis;
TokenOpenParenthesis.value = "(";
class TokenCloseParenthesis {
}
exports.TokenCloseParenthesis = TokenCloseParenthesis;
TokenCloseParenthesis.value = ")";
// Operator
class TokenNot {
}
exports.TokenNot = TokenNot;
TokenNot.value = "NOT";
class TokenEqual {
}
exports.TokenEqual = TokenEqual;
TokenEqual.value = "=";
class TokenNotEqual {
}
exports.TokenNotEqual = TokenNotEqual;
TokenNotEqual.value = "!=";
class TokenLike {
}
exports.TokenLike = TokenLike;
TokenLike.value = "LIKE";
class TokenIs {
}
exports.TokenIs = TokenIs;
TokenIs.value = "IS";
class TokenAnd {
}
exports.TokenAnd = TokenAnd;
TokenAnd.value = "AND";
class TokenOr {
}
exports.TokenOr = TokenOr;
TokenOr.value = "OR";
// Identifier
class TokenIdentifier {
    constructor(value) {
        this.raw = value;
        this.value = (0, utils_1.trim)(value, '"').trim();
    }
}
exports.TokenIdentifier = TokenIdentifier;
TokenIdentifier.regex = /^("[\w-.:[\]]+")|^([\w.]+)/;
// Values
class TokenString {
    constructor(value) {
        this.raw = value;
        this.value = (0, utils_1.trim)(value, "'").trim();
    }
}
exports.TokenString = TokenString;
TokenString.regex = /^('')|^('.*?[^\\]')/;
class TokenNull {
}
exports.TokenNull = TokenNull;
TokenNull.value = "NULL";
class TokenTrue {
}
exports.TokenTrue = TokenTrue;
TokenTrue.value = "TRUE";
class TokenFalse {
}
exports.TokenFalse = TokenFalse;
TokenFalse.value = "FALSE";
class TokenNumber {
    constructor(value) {
        this.raw = value;
        this.value = parseFloat(value);
    }
}
exports.TokenNumber = TokenNumber;
TokenNumber.regex = /^-?\d+(\.\d+)?/;
// Other
class TokenComment {
    constructor(value) {
        this.raw = value;
        this.value = value.slice(2);
    }
}
exports.TokenComment = TokenComment;
TokenComment.regex = /^--[^\n]*/;
//# sourceMappingURL=token.js.map