const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    mode: "production",
    entry: "./src/index.bundle.ts",
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "dist", "bundle"),
    },
    optimization: {
        minimizer: [new TerserPlugin({
            terserOptions: {
                // keep the names the same, otherwise the transverser won't work
                mangle: false,
                keep_classnames: true,
                keep_fnames: true,
            }
        })],
    },
};
