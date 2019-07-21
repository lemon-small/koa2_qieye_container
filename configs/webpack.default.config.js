// nomodule非模块处理，需要编译为es5
const HtmlEs5InjectPlugin = require('../plugins/html-es5-inject-plugin');

const config = {
    output: {
        filename: '[name]-bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    babelrc: false,
                    presets: [
                        [
                            "@babel/preset-env",
                            {
                                "modules": "umd"
                            }
                        ]
                    ],
                    plugins: [
                        "@babel/plugin-transform-runtime",
                        "@babel/plugin-transform-arrow-functions"
                    ]
                }
            }
        ]
    },
    plugins: [
        new HtmlEs5InjectPlugin()
    ]
};

module.exports = config;