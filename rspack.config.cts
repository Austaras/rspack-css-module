import { resolve } from "path";
import { HtmlRspackPlugin, CopyRspackPlugin } from "@rspack/core";
import { type Configuration } from "@rspack/cli";

const modeArg = process.argv.filter((str) => str.startsWith("--mode")).shift();
const mode =
  modeArg !== undefined ? modeArg.split("=")[1].trim() : "development";
export const devMode = mode !== "production";

const config: Configuration = {
  entry: resolve("./src/main.ts"),
  module: {
    generator: {
      "css/auto": {
        exportsConvention: "camel-case-only",
        localIdentName: devMode ? "[uniqueName]-[id]-[local]" : "[hash:6]",
      },
    },
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
  },
  experiments: {
    css: true,
  },
  output: {
    publicPath: "/",
    clean: true,
    path: resolve("./dist"),
    filename: devMode ? "[name].js" : "[name].[contenthash].js",
    assetModuleFilename: devMode ? "[name].[ext]" : "asset/[name].[ext]?[hash]",
  },
  plugins: [
    new HtmlRspackPlugin({
      template: resolve("./index.html"),
    }),
  ].filter(Boolean),
};

export default config;
