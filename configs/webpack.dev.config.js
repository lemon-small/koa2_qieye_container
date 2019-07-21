// const  {join, resolve} = require('path');
const path = require('path');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin'); // 友好的错误处理
const WebpackBuildNotifierPlugin = require('webpack-build-notifier'); // 友好的错误处理
console.log('xxxxxxxxxx', __dirname);

const setTitle = require('node-bash-title'); // 设置iterm2窗标题
setTitle('🍻  开发环境配置');
const setIterm2Badge = require('set-iterm2-badge'); // 设置iterm2窗口大字
const flag = 'Lemon';
setIterm2Badge(flag);

const config = {
    mode: "development", // webpack-web-server需要设置mode为development，不可为别的，否则报错
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        hot: true
    },
    plugins: [
        new FriendlyErrorsWebpackPlugin({
            compilationSuccessInfo: {
                messages: ['You application is running here http://localhost:3000'],
                notes: ['Some additionnal notes to be displayed unpon successful compilation']
            },
            onErrors: function (severity, errors) {
                console.log(errors);
            // You can listen to errors transformed and prioritized by the plugin
            // severity can be 'error' or 'warning'
            }
        }),
        new WebpackBuildNotifierPlugin({
            title: "My Webpack Build",
            logo: path.resolve("lemon.jpeg"),
            suppressSuccess: true
        })
    ]
};

module.exports = config;