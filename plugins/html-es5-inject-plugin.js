// 可独立打包，将打好包的es5 bundlejs放在预置的<!--injectjses5-->中
const pluginName = 'htmlPluginEs5InjectModule';
const assetsHelp = (data) => {
    let js = [];
    let css = [];
    const dir = {
        js: item => `<script class="pjax-js" src="${item}"></script>`,
        css: item => `<link rel="stylesheet" href="${item}" />`,
    };
    for (let jsitem of data.js) {
        js.push(dir.js(jsitem));
    }
    for (let cssitem of data.css) {
        css.push(dir.css(cssitem));
    }
    return {
        js,
        css
    }
};
class HtmlPluginEs5InjectModule {
    constructor () {
    }
    apply (compiler) {
        compiler.hooks.compilation.tap(pluginName, compilation => {
            console.log('构建开始');    
            compilation.hooks.htmlWebpackPluginAlterChunks.tap(pluginName, (htmlPluginData, cb) => {
                console.log('plugin--->>>>>>>>>>>>>>>>>>>>>>', 1);     
                console.log('1--', htmlPluginData);
            });
            
            compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tap(pluginName, (htmlPluginData, cb) => {
                console.log('plugin--->>>>>>>>>>>>>>>>>>>>>>', 2);
                console.log('2--', htmlPluginData);
            });

            compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tap(pluginName, (htmlPluginData, cb) => {
                console.log('plugin--->>>>>>>>>>>>>>>>>>>>>>', 3);
                // console.log(htmlPluginData); // { html: '{% extends \'default.html\' %}\n
                // htmlPluginData.html = htmlPluginData.html.replace(/\snomodule=""/g, " nomodule");
            });
            
            compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync(pluginName, (htmlPluginData, cb) => {
                console.log('plugin--->>>>>>>>>>>>>>>>>>>>>>', 4);
                cb(null, htmlPluginData);
            });

            compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tap(pluginName, (htmlPluginData, cb) => {
                console.log('plugin--->>>>>>>>>>>>>>>>>>>>>>', 5);
                console.log('555', htmlPluginData);
                /*htmlPluginData.body.forEach(tag => {
                });
                cb(null, htmlPluginData);*/
                console.log('ALL---assets!!!!', htmlPluginData.assets); // 所有webpack编译的资源数组，{js: [], css: []}
                let _html = htmlPluginData.html;
                _html = _html.replace(/@components/g, './components');
                _html = _html.replace(/@internal/g, '.');
                let result = assetsHelp(htmlPluginData.assets);
                _html = _html.replace("<!--injectjs-->", result.js.join(""));
                _html = _html.replace("<!--injectcss-->", result.css.join(""));
                htmlPluginData.html = _html;
            });

            compilation.hooks.htmlWebpackPluginAfterEmit.tap(pluginName, (htmlPluginData, cb) => {
                console.log('plugin--->>>>>>>>>>>>>>>>>>>>>>', 6);
            });
        });
    }
}
module.exports = HtmlPluginEs5InjectModule;
