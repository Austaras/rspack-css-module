import { resolve } from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin";
import cssnano from "cssnano";
import { type Configuration } from "@rspack/cli";

const modeArg = process.argv.filter((str) => str.startsWith("--mode")).shift();
const mode =
  modeArg !== undefined ? modeArg.split("=")[1].trim() : "development";
export const devMode = mode !== "production";

const config: Configuration = {
  entry: resolve("./src/main.ts"),
  module: {
    rules: [
      {
        test: /\.tsx$/,
        use: {
          loader: "swc-loader",
          options: {
            env: { coreJs: "3.38", mode: "usage" },
            jsc: {
              parser: {
                syntax: "typescript",
                tsx: true,
                dynamicImport: true,
              },
              loose: true,
              transform: {
                react: {
                  runtime: "automatic",
                  development: devMode,
                  refresh: devMode,
                },
              },
            },
          },
        },
        include: /src/,
      },
      {
        test: /\.(png|jpg|gif|svg|webp|avif)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 1024,
          },
        },
      },
    ],
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
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      chunks: "all",
      minChunks: 2,
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          name: "vendors",
          chunks: "all",
          minChunks: 1,
        },
      },
    },
  },
  devServer: {
    static: { directory: "asset", publicPath: "/asset" },
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve("./index.html"),
    }),
    new OptimizeCSSAssetsPlugin({
      canPrint: false,
    }),
  ].filter(Boolean),
};

export default config;
