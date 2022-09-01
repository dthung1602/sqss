import { transpileSQSSToCSS } from "./index";

/**
 * This file injects the transpile function to the global object
 * The bundle build of this file is meant to be included directly via a <script src="..."> tag
 */

(function (glb) {
    // @ts-ignore
    glb.transpileSQSSToCSS = transpileSQSSToCSS;
})(typeof window !== "undefined" ? window : global);
