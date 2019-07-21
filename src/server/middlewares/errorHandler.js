const errorHandler = {
    error(app, logger) {
        app.use(async (ctx, next) => {
            console.log(1);
            try {
                await next(); // next以后的只要存在报错这里都会到catch
                console.log(11);
            } catch (error) {
                console.log(12222);
                // 如果node挂了，及时的差错
                logger.error(error); // 打印到logs/, 一定有错误一定全部扔出去，发短信打电话
                // ctx.body = '<img src=""/>'; // 报错展示一个图片
                console.log(error.status);
                ctx.status = error.status || 500;
                ctx.body = "错误";
            }
        });
        app.use(async (ctx, next) => {
            console.log(2);
            await next(); // 先让next，该处await暂留，再判断错误情况
            console.log(4);
            if (404 !== ctx.status) {
                console.log('error: ' + ctx.status);
                return;
            }
            ctx.status = 404; // 如果404或者500, 搜索引擎爬虫会对该网站降权，很多网站404但是会仍给status设置200处理
            ctx.body = '<script src="404.html"></script>'; // 报错展示一个404页面
        });
    }
};
export default errorHandler;