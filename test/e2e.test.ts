import { readFile } from "fs/promises";
import { join as joinPath } from "path";

import { transpileSQSSToCSS } from "../src";

const BASIC_SELECT = [
    "basic",
    "class",
    "element",
    "id",
    "attribute",
    "pseudo-class",
    "pseudo-element",
    "and",
    "or",
    "and-or",
];

async function getResourceContent(...path: string[]): Promise<string> {
    const finalPath = joinPath(__dirname, "resources", ...path);
    return readFile(finalPath, "utf8");
}

describe("End to end testing", () => {
    it("should throw errors on SQL syntax errors", async () => {
        const sqss = (await getResourceContent("sql-syntax-error.sql")).split("\n");
        const expectedErrs = (await getResourceContent("sql-syntax-error.txt")).split("\n");
        for (let i = 0; i < sqss.length; i++) {
            expect(() => transpileSQSSToCSS(sqss[i])).toThrow(expectedErrs[i]);
        }
    });

    it.each(BASIC_SELECT)("should transpile basic update queries correctly", async (fileName: string) => {
        const sqss = await getResourceContent(fileName + ".sql");
        const expectedCSS = await getResourceContent(fileName + ".css");
        const css = transpileSQSSToCSS(sqss);
        expect(css).toEqual(expectedCSS);
    });
});
