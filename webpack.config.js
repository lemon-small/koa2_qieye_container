// 编译src/web, 生成到dist
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const CopyPlugin = require('copy-webpack-plugin');
// const argv0 = process.argv.slice(2);
// console.log(argv0);
// // 默认process.argv是数组
const argv = require('yargs-parser')(process.argv.slice(2));
console.log(argv);
// yargs-parser直接将参数转成对象了，--变量为key值, 空格后的为value值
// webpack --NODE_ENV development --modules module
// { _: [], NODE_ENV: 'development', modules: 'module' }

const chalk = require('chalk');
let webpackPublicPath = '';
let webpackEnvConfig = {};
let webpackModuleConfig = {}; // module与module+nomodule兼容打包
let webpackDefaultConfig = require(`./configs/webpack.default.config`); // 默认打包方式
let webpackIsModuleConfig = {}; // 最终以上哪种打包

let _module = argv.modules; // 可能为undefined或者module、nomodule
let isModule = !!_module;


if (argv.NODE_ENV === 'dev') {
    webpackEnvConfig = require(`./configs/webpack.${argv.NODE_ENV}.config`);
    webpackPublicPath = './';
}

if (argv.NODE_ENV === 'prod') {
    webpackEnvConfig = require(`./configs/webpack.${argv.NODE_ENV}.config`);
    webpackPublicPath = '//b.globalworm.com:8082/';
    // webpackPublicPath = '//www.globalworm.com:8082/';
}

if (!isModule) { // 是否采用默认还是module(module，module兼容nomodule)配置
    webpackIsModuleConfig = webpackDefaultConfig;
} else {
    webpackModuleConfig = require(`./configs/webpack.${ argv.modules == 'module' ? "module" : "nomodule"}.config`);
    webpackIsModuleConfig = webpackModuleConfig;
}


// 根据入参，是否编译成module配置
// const webpackModuleConfig = argv[modules] === 'module' ? '' : '';
// if (process.env.NODE_ENV === 'development') {
//     webpackPublicPath = '../../web/'
// }
// if (process.env.NODE_ENV === 'product') {
//     webpackPublicPath = '//globalworm.com/koa2/'
// }

let config = {
    mode: 'development', // 或从CLI命令行
    // resolve: {
    //     modules: [modulesPath,pikNodeModulesPath],
    //     alias: alias || {}
    // },
    // resolveLoader: {
    //     modules: [pikNodeModulesPath]
    // },
    // watch: isWatch,
    entry: {
        // 'views/index': './src/web/views/index.js',
        // update: './src/web/views/update.html',
        // view: './src/web/views/view.html'
    }, // 动态添加入口
    output: {
        path: __dirname + '/dist/web/', // 所有本地资源相对这个目录写路径
        filename: '[name].js',
        // filename: getMD5FileName('[name]', '[chunkhash:8]', 'js'),
        publicPath: webpackPublicPath, // 打包后的路径，原有资源访问本地path会相对于publicPath去写,publicPath要保持一致，同时要考虑是否有设置静态资源访问路径的情况，如serve(staticAssets)
        chunkFilename: `assets/chunks/${getMD5FileName('[name]', '[chunkhash:8]', 'js')}`
    },
    externals: [
        {
            'custom-elements': 'Custom-elements',
            core: 'Core',
            jquery: 'jQuery',
            axios: 'axios'
        }
    ],
    module: {
        rules: [
            // {
            //     test: /\.html$/,
            //     exclude: /node_modules/,
            //     loaders: 'swig-loader'
            // },
            // {
            //     test: /\.js$/,
            //     loader: 'es3ify-loader'
            // }
            // {
            //     test: /\.js$/,
            //     exclude: /node_modules/,
            //     loader: 'babel-loader',
            //     options: {
            //         babelrc: false,
            //         presets: [
            //             [
            //                 "@babel/preset-env",
            //                 {
            //                     "modules": "systemjs"
            //                 }
            //             ]
            //         ],
            //         plugins: [
            //             "@babel/plugin-transform-runtime",
            //             "@babel/plugin-transform-arrow-functions"
            //         ]
            //     }
            // },
            // {
            //     test: /\.js$/,
            //     loader: 'eslint-loader',
            //     exclude: require(path.resolve(pikConfigFilesPath, 'eslintignore.js')),
            //     options: {
            //         configFile: path.resolve(pikConfigFilesPath, 'eslint.json')
            //     }
            // },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    // 'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            }, 
            {
                test: /\.(png|jpe?g|gif|svg|woff|eot|ttf|pkg|exe|woff2)$/,
                exclude: /node_modules/,
                loader: 'file-loader',
                options: {
                    outputPath: `./assets/files/`,
                    name: getMD5FileName('[path][name]', '[hash:8]', '[ext]')
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            "ENV": process.env.NODE_ENV
        })
        // new HtmlWebpackPlugin({template: './src/index.html'})
    ]
};

// const entry = {
//     entryName: 'index',
//     entryPath: './src/web/views/index.js'
// }
// config.entry[entry.entryName]= entry.entryPath;
const entryArr = 
[
    {
        entryName: 'index',
        entryPath: './src/web/views/index.js'
    },
    {
        entryName: 'list',
        entryPath: './src/web/views/list.js'
    },
    {
        entryName: 'second',
        entryPath: './src/web/views/second.js'
    }
]
entryArr.forEach(function (e) {
    config.entry[e.entryName]= e.entryPath;
});



config.plugins.push(
    new MiniCssExtractPlugin({
        filename: getMD5FileName("[name]", "[hash:8]", "css"), //'[name].css?v=[hash]',
        chunkFilename: getMD5FileName("[id]", "[hash:8]", "css") //'[id].css?v=[hash]',
    })
);


function isModulePath (element) {
    if (!isModule) { // 无module概念，传统编译为es5方式打包
        return './src/web/views/' + element + '.html';
    }
    // module方式打包有两种，
    // 1.纯使用module打出的包（仅打一次module即可）、
    // 2.兼容使用module+nomodule方式打包（需要分别打module和nomodule两次，module打后在dist， nomodule再去追加打包，通过plugin注入追加到原html中）
    // module-plugin,nomodule-plugin里面相互注入各自的injectjs或injectes5，以及检查script标签module和nomodule处理或加入兼容早起safari module插件等情况
    return _module == 'module' ? './src/web/views/' + element + '.html' :  './dist/web/' + element + '.html'; 
}

// const htmlArray = ['index', 'update', 'view', 'list', 'second'];
// const htmlArray = [entry.entryName];
const htmlArray = Object.keys(config.entry);
htmlArray.forEach((element) => {
  const chunksArray = [element];
  const newPlugin = new HtmlWebpackPlugin({
    filename: element + '.html',
    // template: _module == 'module' ? './src/web/views/' + element + '.html' : './dist/web/' + element + '.html', // module从src拿，nomodule从打好的文件拿
    template: isModulePath(element), // 是否module方式打包，不传module传统打包成es5然后inject到页面，如果module打包可以直接打module或者module+nomodule兼容方式，共3种方式选择
    chunks: chunksArray, // chunks填写每个被中括号包含的入口，打包的所有资源即为chunks，并与html关联，后期可通过webpack编译周期获取html数据获取资源assets集合
    inject: false // 不默认注入assets
  });
  config.plugins.push(newPlugin);
});


const copyPluginObj = new CopyPlugin([
    {from: path.join(__dirname, "./", "src/web/views/default.html"), to: './default.html'},
    {from: path.join(__dirname, "./", "src/web/views/menu.html"), to: './menu.html'},
    {from: path.join(__dirname, "./", "src/web/views/footer.html"), to: './footer.html'},
    {from: path.join(__dirname, "./", "src/web/components"), to: './components', ignore: ["*.js", "*.css", ".DS_Store"]},
    {from: path.join(__dirname, "./", "src/web/assets/scripts"), to: './assets/scripts'},
]);

config.plugins.push(copyPluginObj);

function getMD5FileName(srcName, md5, extName) {
    // return pikBuildConfig.md5fyAssetsName ? `${srcName}.${md5}.${extName}` : `${srcName}.${extName}?v=${md5}`;
    return  `${srcName}.${md5}.${extName}`;
}
// webpackEnvConfig
// webpack-merge 对象key值覆盖，数组值追加
// console.log('merge', merge({age: 2, list: [{age: 1}, 7, 2]}, {age: 23, name: 232, list: [{age: 5}, 10, 5]}));

console.log('cccc', merge(config, webpackEnvConfig, webpackIsModuleConfig));

module.exports = merge(config, webpackEnvConfig, webpackIsModuleConfig);