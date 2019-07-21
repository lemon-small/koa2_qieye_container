// module需要进行webpack在进行html编译阶段的type=module的处理
// 自定义一个plugin插件处理
const HtmlModulePlugin = require('../plugins/html-module-plugin');
let isHackObj = {isHack: true}; // 是否开启支持加入插件兼容一些支持module但不支持nomodule的浏览器

const config = {
    plugins: [
        new HtmlModulePlugin(isHackObj)
        // new HtmlWebpackPlugin({template: './src/index.html'})
    ]
};

module.exports = config;