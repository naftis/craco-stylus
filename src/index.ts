import { Configuration, RuleSetQuery } from "webpack";

const STYL_REGEX = /\.styl$/;
const STYL_MODULE_REGEX = /\.module\.styl$/;

export const overrideWebpackConfig = ({
  webpackConfig,
  context: { env }
}: {
  webpackConfig: Configuration;
  context: { env: string };
}) => {
  const mode = env === "development" ? "dev" : "prod";
  const getCSSModuleLocalIdent = require("react-dev-utils/getCSSModuleLocalIdent");
  // Need these for production mode, which are copied from react-scripts
  const publicPath = require("react-scripts/config/paths").servedPath;
  const shouldUseRelativeAssetPaths = publicPath === "./";
  const shouldUseSourceMap =
    mode === "prod" && process.env.GENERATE_SOURCEMAP !== "false";

  const getStylusLoader = (cssOptions: RuleSetQuery) => [
    mode === "dev"
      ? require.resolve("style-loader")
      : {
          loader: require("mini-css-extract-plugin").loader,
          options: shouldUseRelativeAssetPaths ? { publicPath: "../../" } : {}
        },
    {
      loader: require.resolve("css-loader"),
      options: cssOptions
    },
    {
      loader: require.resolve("postcss-loader"),
      options: {
        ident: "postcss",
        plugins: () => [
          require("postcss-flexbugs-fixes"),
          require("postcss-preset-env")({
            autoprefixer: {
              flexbox: "no-2009"
            },
            stage: 3
          })
        ],
        sourceMap: shouldUseSourceMap
      }
    },
    {
      loader: require.resolve("stylus-loader"),
      options: {
        source: shouldUseSourceMap
      }
    }
  ];

  const loaders = webpackConfig.module?.rules.find(rule =>
    Array.isArray(rule.oneOf)
  )?.oneOf;

  if (!loaders) {
    return webpackConfig;
  }

  // Insert stylus-loader as the penultimate item of loaders (before file-loader)
  loaders.splice(
    loaders.length - 1,
    0,
    {
      test: STYL_REGEX,
      exclude: STYL_MODULE_REGEX,
      use: getStylusLoader({
        importLoaders: 2
      }),
      sideEffects: mode === "prod"
    },
    {
      test: STYL_MODULE_REGEX,
      use: getStylusLoader({
        importLoaders: 2,
        modules: {
          getLocalIdent: getCSSModuleLocalIdent
        }
      })
    }
  );

  return webpackConfig;
};
