import cheerio from 'cheerio';
import {route, GET} from 'awilix-koa';
import Readable from 'stream';
import fs from 'fs'; // 2
import {resolve} from 'path';


@route('/index') // 根路由
class IndexController {
    constructor ({ booksService }) {
        this.booksService = booksService;
    }
    @route('/index') // 方法路由
    @GET()
    async actionIndex(ctx, next) {
        console.log(1121212);
        // const result = await this.booksService.fetch();
            ctx.body = await ctx.render('index.html', {
                // list: bookData,
                // list: [{bood_id: 1, book_name: 'asd'}],
                list: [
                    {
                        "book_id": "111",
                        "book_name": "aasssss",
                        "author": "aa",
                        "publisher": "aaa",
                        "publish_date": "2000-11-12",
                        "price": "11.00",
                        "sum": "1"
                    },
                    {
                        "book_id": "1233",
                        "book_name": "三国演义",
                        "author": "罗贯中",
                        "publisher": "中国人民出版社",
                        "publish_date": "1980-01-03",
                        "price": "100.00",
                        "sum": "12"
                    },
                    {
                        "book_id": "124",
                        "book_name": "西游记",
                        "author": "吴承恩",
                        "publisher": "清华大学出版社",
                        "publish_date": "1970-06-12",
                        "price": "123.00",
                        "sum": "2"
                    }
                ],
                title: 'my Books'
            });
        // }
    }
    @route('/view')
    @GET()
    async actionView (ctx, next) {
        // async(ctx, next) => {
            const bookData = await axios.get('http://192.168.64.2/basic/web/index.php?r=book%2Fview',{
                params:{
                    id: ctx.params.id
                }
            }).then(function(response){
                debugger;
                return response.data;
            }).catch(function(error){
                debugger;
                console.info(error);
            });
    
            ctx.body = await ctx.render('view.html', {
                id: ctx.params.id,
                bookData: bookData,
                title: 'my view'
            });
        // }
    }
    @route('/update')
    @GET()
    async actionUpdate (ctx, next) {
        // async(ctx, next) => {
            const bookData = await axios.get('http://192.168.64.2/basic/web/index.php?r=book%2Fview',{
                params:{
                    id: ctx.params.id
                }
            }).then(function(response){
                debugger;
                return response.data;
            }).catch(function(error){
                debugger;
                console.info(error);
            });

            ctx.body = await ctx.render('update.html', {
                bookData: bookData,
                title: 'my update'
            });
        // }
    }
    @route('/home')
    @GET()
    async actionHome (ctx, next) {
        // async(ctx, next) => {
            const list = [
                {
                    name: 'liu',
                    age: 22
                },
                {
                    name: 'huang',
                    age: 25
                },
                {
                    name: 'zhang',
                    age: 27
                }
            ];
            ctx.body = await ctx.render('tpl', {
                title: 'koa实战',
                list
            });
        // }
    }
    @route('/list')
    @GET()
    async actionList (ctx, next) {
        const task1 = () => {
            return new Promise((resolve, reject) => {
                setTimeout(function () {
                    // 2.0 resolve('第一次传输 <br />');
                    // 2.1 借助页面script针对输出
                    resolve(`<script>addHtml("part1", "第一次输出")</script>`);
                }, 2000);
            })
        };
        const task2 = () => {
            return new Promise((resolve, reject) => {
                setTimeout(function () {
                    // 2.0 resolve('第二次传输 <br />');
                    // 2.1 借助页面script针对输出
                    resolve(`<script>addHtml("part2", "第二次输出")</script>`);
                }, 3000);
            })
        };
        const html = await ctx.render('list.html', {
            list: [
                {
                    "book_id": "124",
                    "book_name": "西游记",
                    "author": "吴承恩",
                    "publisher": "清华大学出版社",
                    "publish_date": "1970-06-12",
                    "price": "123.00",
                    "sum": "2"
                }
            ],
            title: 'my Books'
        }); 
        if (ctx.request.header['x-pjax']) {
            // 3.2 这里整个内容做seo不影响, 因为是mpa + 切页spa
            // 3.2 加响应头
            ctx.status = 200;
            ctx.type = 'html';

            let result = '';
            let $ = cheerio.load(html); // 3 实现切页spa的页面请求处理后下次访问进行将内容段缓存取
            // result += $('.pjax-list-content').html();

            // 遍历页面中的html块与script脚本块（需事先在webpack plugin配置中添加class类以便获取）
            $('.pjax-list-content').each(function () {
                // result += $(this).html();
                // 3.1 读到分段输出，chunk形式
                ctx.res.write($(this).html());
            });
            $('.pjax-js').each(function () {
                // result += `<script src="${$(this).attr('src')}"></script>`;
                // 3.1 读到分段输出，chunked形式
                ctx.res.write(`<script src="${$(this).attr('src')}"></script>`);

                // 4 核心basket.js
                // 看localStorage是否有，有就不请求了直接激活，没有就请求
                // ctx.res.write(`<script>activeJS('${$(this).attr("src")}')</script>`);
            });
            // ctx.body = result;
            // 3.1
            ctx.res.end();

        } else {
            // 3.2 这里整个内容需要做seo，可以将主的页面结构提前放
            // 0 ctx.body = html; // 最慢需要优化

            // // 1 使用stream的Readable的bigpipe对页面进行分段输出
            // function createSSRStreamPromise () {
            //     return new Promise((resolve, reject) => {
            //         const htmlStream = new Readable();
            //         htmlStream.push(html);
            //         htmlStream.push(null);
            //         ctx.status = 200;
            //         ctx.type = 'html';
            //         htmlStream.on('error', err => {
            //             reject(err);
            //         }).pipe(ctx.res);
            //     });
            // }
            // await createSSRStreamPromise();
 

            // 2.0 ctx.res.write串行分片输出
            // ctx.status = 200;
            // ctx.type = 'html';
            // ctx.res.write('loading');
            // const result = await task1();
            // ctx.res.write(result);
            // const result2 = await task2();
            // ctx.res.write(result2);
            // ctx.res.end();

            // // 2.1 使用ctx.res.write分片输出，串行指定预设块输出
            // ctx.status = 200;
            // ctx.type = 'html';
            // // 2.1.3 add file
            // const file = fs.readFileSync('./index.html', 'utf-8');
            // ctx.res.write(file);
            // // 2.1.2 但有个问题2.0分片输出是不断向后串行追加的，这里将实现指定块输出
            // const result = await task1();
            // ctx.res.write(result);
            // const result2 = await task2();
            // ctx.res.write(result2);
            // // 2.1.4 事先将index.html中的</body>和</html>抽出，放在这里做结束，不破坏页面执行结构在此之前就可以写script语句
            // ctx.res.write('</body></html>');
            // ctx.res.end();
            // // 2.1.5对html中输出区块加入id标记，script后做针对输出处理
            // // index.html中处理
            // // <div id="app">core</div>
            // // <section>
            // //     <div id="part1">loading</div>
            // //     <div id="part2">loading</div>
            // // </section>
            // // <script>
            // //     function addHtml (name, content) {
            // //         document.getElementById(name).innerHTML = content;
            // //     }
            // // </script>

            // // 2.2 实现异步输出ctx.res片
            // ctx.status = 200;
            // ctx.type = 'html';
            // const file = fs.readFileSync('./index.html', 'utf-8');
            // ctx.res.write(file);
            // await Promise.all([
            //     task1().then(r => {
            //         ctx.res.write(r);
            //     }), 
            //     task2().then(r => {
            //         ctx.res.write(r);
            //     })
            // ]);
            // ctx.res.write('</body></html>');
            // ctx.res.end();

            // 2.3 使用stream读文件边读边吐优化, 优化read html文件比较大的情况
            ctx.status = 200;
            ctx.type = 'html';
            // 改 const file = fs.readFileSync('./index.html', 'utf-8');
            // 改 ctx.res.write(file);
            const filename = resolve(__dirname, "index.html");
            const stream = fs.createReadStream(filename);
            stream.on('data', (chunk) => {
                // 将得到的每一小块输出
                console.log('i am a small block', chunk); // 这是一个个小buffer
                ctx.res.write(chunk); // 一次次往前吐
            });
            // stream.pipe(ctx.res); // 这种会阻塞后面的输出
            await Promise.all([
                task1().then(r => {
                    ctx.res.write(r);
                }), 
                task2().then(r => {
                    ctx.res.write(r);
                })
            ]);
            ctx.res.write('</body></html>');
            ctx.res.end();
        }
    }
    @route('/second')
    @GET()
    async actionSecond (ctx, next) {
        // async(ctx, next) => {
            const list = [
                {
                    name: 'liu',
                    age: 22
                },
                {
                    name: 'huang',
                    age: 25
                },
                {
                    name: 'zhang',
                    age: 27
                }
            ];
            ctx.body = await ctx.render('second', {
                title: 'second',
                list
            });
        // }
    }
}
export default IndexController;