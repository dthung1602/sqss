import { Token } from "./token";
export default class Lexer {
    input: string;
    constructor(input: string);
    scan(): Token[];
    next(): Token | null;
    private matchExact;
    private static isWord;
    private static isSeparator;
    private matchRegex;
}
