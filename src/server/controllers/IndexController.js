import Request from '../models/Request.js';
import cheerio from 'cheerio';
class IndexController {
    constructor () {
    }
    async actionIndex(ctx, next) {
        // async(ctx, next) => {
            // const bookData = await axios.get('http://192.168.64.2/basic/web/index.php?r=book%2Findex',{
            //     params:{
            //     }
            // }).then(function(response){
            //     // console.info(response);
            //     // console.info(response.data);
            //     return response.data;
            // }).catch(function(error){
            //     console.info(error);
            // });
            
            // console.log(ctxy); // 这里报错会进入errorHandler的catch中被log记录

            // 生产屏蔽以下4句，模拟mock数据
            // const request = new Request("book/index");
            // const reqData = {};
            // const bookData = await request.fetch(reqData);
            // console.log(bookData);
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
    async actionList (ctx, next) {
        const html = await ctx.render('list.html', {
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
        // console.log(ctx);
        console.log('ppppjax', ctx.request.header['x-pjax']);
        if (ctx.request.header['x-pjax']) {
            let result = '';
            let $ = cheerio.load(html);
            // result += $('.pjax-list-content').html();

            // 遍历页面中的html块与script脚本块（需事先在webpack plugin配置中添加class类以便获取）
            $('.pjax-list-content').each(function () {
                result += $(this).html();
            });
            $('.pjax-js').each(function () {
                result += `<script src="${$(this).attr('src')}"></script>`;
            });
            console.log('hhhhhhhh---hhhhh----hhhh', result);
            ctx.body = result;
            // pjax-list
        } else {
            ctx.body = html;
        }
    }
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