import { readFile } from "fs/promises";
import { join as joinPath } from "path";

import { transpileSQSSToCSS } from "../src";

const BASIC_SELECT = ["id"];

async function getResourceContent(...path: string[]): Promise<string> {
    const finalPath = joinPath(__dirname, "resources", ...path);
    return readFile(finalPath, "utf8");
}

describe("End to end testing", () => {
    it.each(BASIC_SELECT)("should transpile basic select correctly", async (fileName: string) => {
        const sqss = await getResourceContent(fileName + ".sql");
        const expectedCSS = await getResourceContent(fileName + ".css");
        const css = transpileSQSSToCSS(sqss);
        expect(css).toEqual(expectedCSS);
    });
});
