import { readFile } from "fs/promises";
import { join as joinPath } from "path";

import { transpileSQSSToCSS } from "../src";

const BASIC_SELECT = ["basic", "id", "class", "element"];

async function getResourceContent(...path: string[]): Promise<string> {
    const finalPath = joinPath(__dirname, "resources", ...path);
    return readFile(finalPath, "utf8");
}

describe("End to end testing", () => {
    it("should throw errors on SQL syntax and semantic errors", async () => {
        const sqss = (await getResourceContent("sql-error.sql")).split("\n");
        const expectedErrs = (await getResourceContent("sql-error.txt")).split("\n");
        for (let i = 0; i < sqss.length; i++) {
            expect(() => transpileSQSSToCSS(sqss[i])).toThrow(expectedErrs[i]);
        }
    });

    it.each(BASIC_SELECT)("should transpile basic select correctly", async (fileName: string) => {
        const sqss = await getResourceContent(fileName + ".sql");
        const expectedCSS = await getResourceContent(fileName + ".css");
        const css = transpileSQSSToCSS(sqss);
        expect(css).toEqual(expectedCSS);
    });
});
