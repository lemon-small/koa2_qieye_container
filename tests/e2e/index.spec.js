// rize + puppeteer
const Rize = require('rize');
const rize = new Rize({ headless: false });
rize
.goto('https://www.baidu.com/')
.type('input.s_ipt','node')
.press('Enter')
.waitForNavigation()
.assertSee('Node.js')
.end()