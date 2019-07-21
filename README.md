MPA + 切页spa
1、具有一个首页加载了所有资源, 其他页面使用a链接，站内页不跳转采用加载局部替换的方案
2、default页加载pjax包和jquery, pjax绑定a链接所需要替换的元素区间如#app
3、node服务端获取请求头是否为x-pjax，进行cheerio获取站内跳页的局部内容html或js（js需要事先在webpack的插件中定义类方便获取），替换content
4、实现解决了资源不用重复加载mpa的缺点，融合mpa的路由优势与seo和ssr直刷再实现站内切页spa的无白屏情况；


5、解决手动配置路由的繁琐问题