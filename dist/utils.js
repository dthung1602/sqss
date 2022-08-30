"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xor = exports.printTree = exports.cartesian = exports.isNonNegativeInteger = exports.isBool = exports.isString = exports.isKebabCase = exports.extractTableFromSelector = exports.isPseudoClassSelector = exports.isPseudoElementSelector = exports.isAttrSelector = exports.isSimpleSelector = exports.assertTrue = exports.assertEqual = exports.startsWith = exports.containAnyStr = exports.trunkString = exports.trimStart = exports.trimEnd = exports.trim = void 0;
const inspect_1 = require("./inspect");
//=============================================
//                  STRING
//=============================================
// Copied from https://stackoverflow.com/a/55292366/7342188
function trim(str, ch) {
    return trimStart(trimEnd(str, ch), ch);
}
exports.trim = trim;
function trimEnd(str, ch) {
    let end = str.length;
    while (end > 0 && str[end - 1] === ch)
        --end;
    return end < str.length ? str.substring(0, end) : str;
}
exports.trimEnd = trimEnd;
function trimStart(str, ch) {
    let start = 0;
    while (start < str.length && str[start] === ch)
        ++start;
    return start > 0 ? str.substring(start) : str;
}
exports.trimStart = trimStart;
function trunkString(str, maxLength) {
    if (str.length > maxLength) {
        return str.slice(maxLength) + " ...";
    }
    return str;
}
exports.trunkString = trunkString;
function containAnyStr(str, subStrs) {
    for (const s of subStrs) {
        if (str.includes(s))
            return s;
    }
    return null;
}
exports.containAnyStr = containAnyStr;
function startsWith(str, startStrs) {
    for (const s of startStrs) {
        if (str.startsWith(s))
            return s;
    }
    return null;
}
exports.startsWith = startsWith;
//=============================================
//                  ASSERT
//=============================================
function assertEqual(value, expected, message = "") {
    if (value !== expected) {
        throw new Error(message || `Expected ${expected}, got ${value}`);
    }
}
exports.assertEqual = assertEqual;
function assertTrue(value, message = "") {
    assertEqual(value, true, message);
}
exports.assertTrue = assertTrue;
//=============================================
//               CSS SELECTOR
//=============================================
function isSimpleSelector(str) {
    return ["id", "class", "element"].includes(str);
}
exports.isSimpleSelector = isSimpleSelector;
const ATTR_NAME_REGEX = /^\[.+]$/;
function isAttrSelector(str) {
    return Boolean(str.match(ATTR_NAME_REGEX));
}
exports.isAttrSelector = isAttrSelector;
const PSEUDO_ELEMENT_REGEX = /^::[^:]+$/;
function isPseudoElementSelector(str) {
    return Boolean(str.match(PSEUDO_ELEMENT_REGEX));
}
exports.isPseudoElementSelector = isPseudoElementSelector;
const PSEUDO_CLASS_REGEX = /^:[^:]+$/;
function isPseudoClassSelector(str) {
    return Boolean(str.match(PSEUDO_CLASS_REGEX));
}
exports.isPseudoClassSelector = isPseudoClassSelector;
function extractTableFromSelector(str) {
    const parts = str.split(".");
    if (parts.length === 2) {
        return parts[0];
    }
    return "styles";
}
exports.extractTableFromSelector = extractTableFromSelector;
//=============================================
//                 GENERIC
//=============================================
const KEBAB_CASE_REGEX = /^-?-?[a-z]+(-[a-z]+)*$/;
function isKebabCase(str) {
    return Boolean(str.match(KEBAB_CASE_REGEX));
}
exports.isKebabCase = isKebabCase;
function isString(value) {
    return value instanceof String || typeof value === "string";
}
exports.isString = isString;
function isBool(value) {
    return value instanceof Boolean || typeof value === "boolean";
}
exports.isBool = isBool;
function isNonNegativeInteger(value) {
    return (value instanceof Number || typeof value === "number") && value > 0 && Math.floor(value) === value;
}
exports.isNonNegativeInteger = isNonNegativeInteger;
function cartesian(...allEntries) {
    return allEntries.reduce((results, entries) => results
        .map((result) => entries.map((entry) => [...result, entry]))
        .reduce((subResults, result) => [...subResults, ...result], []), [[]]);
}
exports.cartesian = cartesian;
function printTree(root, message) {
    // TODO inspect is available only for node, need to remove
    console.log("\n" + message + ": \n");
    console.log((0, inspect_1.default)(root));
    console.log("--------------------------------------------------------------------------------------------------\n");
}
exports.printTree = printTree;
function xor(a, b) {
    return (a && !b) || (!a && b);
}
exports.xor = xor;
//# sourceMappingURL=utils.js.map