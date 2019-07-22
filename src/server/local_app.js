import Koa from 'koa';
const app = new Koa();
import router from 'koa-simple-router'; // 路由
import koaBody from 'koa-body'; // 可以接收到_.post的传来数据，ctx.request.body
import render from 'koa-swig'; // swig视图模版
import convert from 'koa-convert'; // 转换koa1的插件使之koa2能够使用
import serve from 'koa-static'; // 处理静态资源文件
import co from 'co'; // 挂载视图兼容koa1的generator和yield
import { configure, getLogger } from 'log4js'; // 配置错误日志
import { join } from 'path';

// const _root = join(__dirname, 'src', 'server');
const _root = join(__dirname);
console.log(_root);
// const route = require(join(_root, 'controllers')); // 路由类
// const config = require(join(_root, 'configs')); // 工具类，一些参数配置
// const errorHandler = require(join(_root, 'middlewares/errorHandler'));

// import route from './controllers/index'; // 路由类
import config from './configs/index'; // 工具类，一些参数配置
import errorHandler from './middlewares/errorHandler';

// 引入容器概念，进行依赖注入, 必须把servive放入容器里
import { createContainer, Lifetime } from 'awilix';
import { loadControllers, scopePerRequest } from 'awilix-koa';
const container = createContainer();
container.loadModules([__dirname + '/services/*.js'], { //容器注入model
    formatName: "camelCase", // 写法方式，驼峰
    resolverOptions: {
        lifetime: Lifetime.SCOPED // 生命周期
    }
});
// 终极注入
app.use(scopePerRequest(container)); // controller放入注入了model的东西

// log4js配置日志
configure({
    appenders: {cheese: {type: 'file', filename: join(_root, 'logs/error.log')}},
    categories: {default: {appenders: ['cheese'], level: 'error'}}
});
const logger = getLogger('cheese');

// koa挂载错误处理，并加入log4js做日志打印
// errorHandler.error(app, logger);

errorHandler.error(app); // 改传递去掉logger, 直接挂到context, ctx上
app.context.logger = logger;

// console.log('process env:', process.env);
console.log('env:', process.env.NODE_ENV);
console.log(9999);
console.log('hi', config);
console.log(config.ViewDir);
// koa挂载视图, View
render(app, {
    // root: path.join(__dirname, './views'),
    root: config.ViewDir,
    autoescape: true,
    // cache: 'memory', // 尽量false
    ext: 'html',
    writeBody: false,
    varControls: ["[[", "]]"] // 自定义swig模版括号符号为[[ ]]
});
// koa2使用co挂载视图兼容koa1的generator和yield
app.context.render = co.wrap(app.context.render);

// 使用koa-body, 使路由可接收post请求数据
app.use(koaBody());

// koa挂载路由router, Controller
// app.use(router(route));

// koa-static指定静态资源文件，通过koa-convert将koa1插件迁移使得koa2可以兼容使用
app.use(convert(serve(config.AssetsDir)));

// koa监听服务端口，使用node进行启动

console.log('----------', __dirname + '/controllers/*.js');
app.use(loadControllers(__dirname + '/controllers/*.js')); // 直接将controller放入到容器中，改写controller引入awilix-koa的route和GET的特征装饰器

app.listen(config.port, (data) => {
    console.log('server listening port 启动成功！');
});

process.on("uncaughtException", function (err) { 
    // g.notifyError(a, { type: "uncaughtError" }, 
    // function () { process.exit(1) }) 
    logger.error(err);
})
process.on("unhandledRejection", function (info) { // 捕获promise错误
    // g.notifyError(a, { type: "uncaughtError" }) 
    logger.error(info.reason);
});
app.on("error", function (err) { // 处理包的错误
    logger.error(info.reason);
})