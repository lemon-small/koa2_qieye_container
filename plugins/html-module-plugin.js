const pluginName = 'htmlPluginModule';
const hackCode = `(function () {
    // 这段代码可以直接加到html顶部
    var check = document.createElement('script');
    if (!('noModule' in check) && 'onbeforeload' in check) {
        var support = false;
        document.addEventListener('beforeload', function (e) {
            if (e.target === check) {
                support = true
            } else if (!e.target.hasAttribute('nomodule') || !support) {
                return;
            }
            e.preventDefault();
        }, true);
        // 下面这里异步先执行
        check.type = 'module';
        check.src = '.';
        document.head.appendChild(check);
        check.remove();
    }
}())`;
const assetsHelp = (data) => {
    let js = [];
    let css = [];
    const dir = {
        js: item => `<script  class="pjax-js"  type="module" src="${item}"></script>`,
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
class HtmlPluginModule {
    constructor ({ isHack } = options) {
        this.isHack = isHack;
    }
    apply (compiler) {
        compiler.hooks.compilation.tap(pluginName, compilation => {
            console.log('构建开始');
            // 既支持module又支持nomodule的浏览器，既不支持module又不支持nomodule浏览器，支持module但不支持nomodule的浏览器
            // 以上可以通过两个script标签解决
            // <script src="abc.js" nomodule></script>
            // <script type="module" src="abc.js"></script>
            // 第一个script, nomodule不支持的浏览器都会加载src, type形式则不会加载，唯一存在问题：增加支持module，不支持nomodule的浏览器，会加载两次，需要做兼容处理    
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
                htmlPluginData.html = htmlPluginData.html.replace(/\snomodule=""/g, " nomodule");
            });
            
            compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync(pluginName, (htmlPluginData, cb) => {
                console.log('plugin--->>>>>>>>>>>>>>>>>>>>>>', 4);
                /**
                 * { head: 
                [ { tagName: 'link',
                    selfClosingTag: false,
                    voidTag: true,
                    attributes: [Object] } ],
                body: [ { tagName: 'script',  */
                console.log(htmlPluginData);
                // safari nomodule兼容插件
                // 阻止了nomodule加载
                // if (this.isHack) { // 暴露参数给外面控制，true时，提供module和nomodule浏览器兼容处理
                //     htmlPluginData.body.push({
                //         tagName: "script",
                //         closeTag: true,
                //         innerHTML: hackCode
                //     });
                // }
                // htmlWebpackPluginAlterAssetTags 把钩子写在这
                htmlPluginData.body.forEach(tag => {
                    if (tag.tagName == "script"){
                        console.log('attr--', tag.attributes);
                        if (/-bundle\./.test(tag.attributes.src)) {
                            delete tag.attributes.type;
                            tag.attributes.nomodule = "";
                        } else {
                           tag.attributes.type = "module";
                        }
                    }
                });
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
                console.log('zzzzzzz-----', result);
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
module.exports = HtmlPluginModule;
