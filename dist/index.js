"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var STYL_REGEX = /\.styl$/;
var STYL_MODULE_REGEX = /\.module\.styl$/;
exports.overrideWebpackConfig = function (_a) {
    var webpackConfig = _a.webpackConfig, env = _a.context.env;
    var _b, _c;
    var mode = env === "development" ? "dev" : "prod";
    var getCSSModuleLocalIdent = require("react-dev-utils/getCSSModuleLocalIdent");
    // Need these for production mode, which are copied from react-scripts
    var publicPath = require("react-scripts/config/paths").servedPath;
    var shouldUseRelativeAssetPaths = publicPath === "./";
    var shouldUseSourceMap = mode === "prod" && process.env.GENERATE_SOURCEMAP !== "false";
    var getStylusLoader = function (cssOptions) { return [
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
                postcssOptions: {
                    ident: "postcss",
                    plugins: function () { return [
                        require("postcss-flexbugs-fixes"),
                        require("postcss-preset-env")({
                            autoprefixer: {
                                flexbox: "no-2009"
                            },
                            stage: 3
                        })
                    ]; },
                },
                sourceMap: shouldUseSourceMap
            }
        },
        {
            loader: require.resolve("stylus-loader"),
            options: {
                sourceMap: shouldUseSourceMap
            }
        }
    ]; };
    var loaders = (_c = (_b = webpackConfig.module) === null || _b === void 0 ? void 0 : _b.rules.find(function (rule) {
        return Array.isArray(rule.oneOf);
    })) === null || _c === void 0 ? void 0 : _c.oneOf;
    if (!loaders) {
        return webpackConfig;
    }
    // Insert stylus-loader as the penultimate item of loaders (before file-loader)
    loaders.splice(loaders.length - 1, 0, {
        test: STYL_REGEX,
        exclude: STYL_MODULE_REGEX,
        use: getStylusLoader({
            importLoaders: 2
        }),
        sideEffects: mode === "prod"
    }, {
        test: STYL_MODULE_REGEX,
        use: getStylusLoader({
            importLoaders: 2,
            modules: {
                getLocalIdent: getCSSModuleLocalIdent
            }
        })
    });
    return webpackConfig;
};
