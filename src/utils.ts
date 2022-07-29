//=============================================
//                  STRING
//=============================================

// Copied from https://stackoverflow.com/a/55292366/7342188
import { inspect } from "util";

import { CSSNode } from "./css/ast";
import { SqssNode } from "./sqss/ast";

export function trim(str: string, ch: string): string {
    return trimStart(trimEnd(str, ch), ch);
}

export function trimEnd(str: string, ch: string): string {
    let end = str.length;

    while (end > 0 && str[end - 1] === ch) --end;

    return end < str.length ? str.substring(0, end) : str;
}

export function trimStart(str: string, ch: string): string {
    let start = 0;

    while (start < str.length && str[start] === ch) ++start;

    return start > 0 ? str.substring(start) : str;
}

export function trunkString(str: string, maxLength: number) {
    if (str.length > maxLength) {
        return str.slice(maxLength) + " ...";
    }
    return str;
}

export function containAnyStr(str: string, subStrs: string[]): null | string {
    for (const s of subStrs) {
        if (str.includes(s)) return s;
    }
    return null;
}

export function startsWith(str: string, startStrs: string[]): null | string {
    for (const s of startStrs) {
        if (str.startsWith(s)) return s;
    }
    return null;
}

//=============================================
//                  ASSERT
//=============================================

export function assertEqual(value: unknown, expected: unknown, message = "") {
    if (value !== expected) {
        throw new Error(message || `Expected ${expected}, got ${value}`);
    }
}

export function assertTrue(value: unknown, message = "") {
    assertEqual(value, true, message);
}

//=============================================
//               CSS SELECTOR
//=============================================

export function isSimpleSelector(str: string): boolean {
    return ["id", "class", "element"].includes(str);
}

const ATTR_NAME_REGEX = /^\[.+]$/;

export function isAttrSelector(str: string): boolean {
    return Boolean(str.match(ATTR_NAME_REGEX));
}

const PSEUDO_ELEMENT_REGEX = /^::[^:]+$/;

export function isPseudoElementSelector(str: string): boolean {
    return Boolean(str.match(PSEUDO_ELEMENT_REGEX));
}

const PSEUDO_CLASS_REGEX = /^:[^:]+$/;

export function isPseudoClassSelector(str: string): boolean {
    return Boolean(str.match(PSEUDO_CLASS_REGEX));
}

//=============================================
//                 GENERIC
//=============================================

const KEBAB_CASE_REGEX = /^-?-?[a-z]+(-[a-z]+)*$/;

export function isKebabCase(str: string): boolean {
    return Boolean(str.match(KEBAB_CASE_REGEX));
}

export function isString(value: unknown) {
    return value instanceof String || typeof value === "string";
}

export function isBool(value: unknown) {
    return value instanceof Boolean || typeof value === "boolean";
}

export function cartesian<T>(...allEntries: T[][]): T[][] {
    return allEntries.reduce<T[][]>(
        (results, entries) =>
            results
                .map((result) => entries.map((entry) => [...result, entry]))
                .reduce((subResults, result) => [...subResults, ...result], []),
        [[]],
    );
}

export function printTree(root: SqssNode | CSSNode, message: string) {
    console.log("\n" + message + ": \n");
    console.log(inspect(root, true, null, true));
    console.log("--------------------------------------------------------------------------------------------------\n");
}

export function xor(a: boolean, b: boolean): boolean {
    return (a && !b) || (!a && b);
}
