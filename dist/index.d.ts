import { Configuration } from "webpack";
export declare const overrideWebpackConfig: ({ webpackConfig, context: { env } }: {
    webpackConfig: Configuration;
    context: {
        env: string;
    };
}) => Configuration;
