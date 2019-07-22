一、MPA + 切页spa
1、具有一个首页加载了所有资源, 其他页面使用a链接，站内页不跳转采用加载局部替换的方案
2、default页加载pjax包和jquery, pjax绑定a链接所需要替换的元素区间如#app
3、node服务端获取请求头是否为x-pjax，进行cheerio获取站内跳页的局部内容html或js（js需要事先在webpack的插件中定义类方便获取），替换content
4、实现解决了资源不用重复加载mpa的缺点，融合mpa的路由优势与seo和ssr直刷再实现站内切页spa的无白屏情况；
5、解决手动配置路由的繁琐问题
app去掉路由的注册挂载，
去掉路由配置文件，去掉controller中model引用，model去掉其他配置引入-方法中直接写

ioc // 依赖注入，告诉谁，引入谁，大的过程叫控制反转，容器的概念
aop // 面向切面编程
ioc di aop
使用包awilix, awilix-koa
改写controller 去除model的调用，改写成awilix-koa容器装饰器特征
改写model, 去除多余的url配置，方法中直接写
app中去除路由配置，改写awilix和awilix-koa对于路由的容器引用与容器注入model,最后将controller和model关联

安装装饰器：@babel/plugin-proposal-decorators

?启动有问题

改传递，尽量不传，去除logger传到errorHandler，直接挂载到app.context.logger = logger;

二、
使用bigpipe分片技术处理大页面，结合stream文件流以及异步对位输出优化；
分片输出优化mpa + 切页spa；
使用basketjs对于mpa + spa加载过的资源缓存
quicklink 链接预加载


常见错误类型与特性，错误捕获不爆红
错误性能监控fundebug
性能监控系统zaneperfor, 
用户错误记录xpath（图片记录用户前后操作10步）, session stack（可生成用户录像）

