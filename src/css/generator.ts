import { CSSStyleSheet } from "./ast";

export default class Generator {
    constructor(public styleSheet: CSSStyleSheet) {}

    generate(): string {
        return "";
    }
}
