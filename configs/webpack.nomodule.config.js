// nomodule非模块处理，需要编译为es5
const HtmlNoModulePlugin = require('../plugins/html-nomodule-plugin');
let isHackObj = {isHack: true}; // 是否开启支持加入插件兼容一些支持module但不支持nomodule的浏览器

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
        new HtmlNoModulePlugin(isHackObj)
    ]
};

module.exports = config;