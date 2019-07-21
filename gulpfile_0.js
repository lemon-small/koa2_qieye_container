// 编译src/server, 生成到dist
var gulp = require('gulp');

var replace = require('rollup-plugin-replace'); // 实现rollup编译时将环境变量注入，实现流清洗
console.log('gulpfile NODE_ENV:', process.env.NODE_ENV);
var env = process.env.NODE_ENV; // 环境变量


// 使用的是gulp-rollup

// 不是这个
// var rollup = require('rollup'); // 这是roll-up包不兼容gulp
// var rollupTypescript = require('rollup-plugin-typescript')

// var rollup = require('gulp-better-rollup'); // 另一种gulp-rollup
// var sourcemaps = require('gulp-sourcemaps') // 配合gulp-better-rollup

var rollup = require('gulp-rollup'); // 处理最终需要的主要入口文件，其他文件为引入

var rollupEach = require('gulp-rollup-each'); // 具有遍历文件编译输出的gulp-rollup，其实最终生成的是在controllers/index.js里面，所有文件都被引入了，并且rollup默认是开启了tree-shaking的

var path = require('path');

// var resolve = require('rollup-plugin-node-resolve'); // 处理es5, es6的node模块，不需要bundle, 不需要webpack, gulp就好
// var commonjs = require('rollup-plugin-commonjs'); // 处理es5
var rollupNodeBuiltins = require('rollup-plugin-node-builtins');

var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

// var paths = {
//     scripts: ['local_app.js', 'app.js']
// };

// gulp.task('gulp-rollup-each', function () {
//     // your work
//     return gulp.src('./src/server/**/*.js') // 批量处理
//         // gulp-rollup tree-shaking

//         // .pipe(rollup({ // gulp-better-rollup
//         //     // There is no `input` option as rollup integrates into the gulp pipeline
//         //     plugins: []
//         //   }, {
//         //     // Rollups `sourcemap` option is unsupported. Use `gulp-sourcemaps` plugin instead
//         //     format: 'umd',
//         //   }))
//         //   .pipe(sourcemaps.write())

//         .pipe(rollupEach(
//             // output: {
//             //     // outputOptions
//             //     format: 'umd'
//             // }
//             {
//                 external: [
//                     'lodash', //告诉rollup不要将此lodash打包, 作为外部依赖
//                     'axios',
//                     'path',
//                     'koa',
//                     'koa-simple-router',
//                     'koa-body',
//                     'koa-swig',
//                     'koa-convert',
//                     'koa-static',
//                     'co',
//                     'log4js'
//                 ],
//                 // plugins: [/* ... */]
//                 plugins: [
//                     rollupNodeBuiltins(),
//                     replace({
//                         'process.env.NODE_ENV': JSON.stringify(env)
//                     })
//                 ],
//             },
//             file => {
//                 return {
//                     format: 'umd',
//                     name: path.basename(file.path, '.js'),
//                     globals: {
//                         // 'lodash': 'lodash',  // 前面包，后面为global全局别名，在任何地方可以使用的其实加了global.router,不写也不影响已有代码包的变量引入名的使用
//                         // 'axios': 'axios',
//                         // 'path': 'path',
//                         // 'koa': 'Koa',
//                         // 'koa-simple-router': 'router',
//                         // 'koa-body': 'koaBody',
//                         // 'koa-swig': 'render',
//                         // 'koa-convert': 'convert',
//                         // 'koa-static': 'serve',
//                         // 'co': 'co',
//                         // 'log4js': 'log4js'
//                     }
//                 }
//             }
//         ))
        
//         // // es6转es5
//         .pipe(babel({
//             "presets": [
//                 [
//                     "@babel/preset-env",
//                     {
//                         "modules": "umd"
//                     }
//                 ]
//             ],
//             "plugins": [
//                 "@babel/plugin-transform-runtime",
//                 "@babel/plugin-transform-arrow-functions"
//             ]
//         }))
//         // // .pipe(uglify())
//         // // .pipe(concat('all.min.js'))
//         .pipe(gulp.dest('dist/server'));
// });
var buildDev = function () {

};

var buildProd = function () {

};


if (env === 'dev') {
    build = gulp.series(buildDev);
    // build = gulp.task('', function () {
} else if (env === 'prod') {
    build = gulp.series(buildProd);
}

build = gulp.task('gulp-rollup', function () {
// gulp-rollup处理
gulp.task('gulp-rollup', function () {
    console.log(1800);
    // gulp.src(paths)
    return gulp.src('./src/server/**/*.js')
        .pipe(rollup({
            input: './src/server/local_app.js', // 只能执行单个文件，不可批量**
            format: 'umd',
            plugins: [
                replace({
                    'process.env.NODE_ENV': JSON.stringify(env)
                })
            ]
        }))
        // es6转es5
        .pipe(babel({
            "presets": [
                [
                    "@babel/preset-env",
                    {
                        "modules": "umd"
                    }
                ]
            ],
            "plugins": [
                "@babel/plugin-transform-runtime",
                "@babel/plugin-transform-arrow-functions"
            ]
        }))
        .pipe(gulp.dest('dist'));
});

//启动热更新
// gulp.task('serve', function() {
//     // gulp.watch('./src/**/*.js', ['script']); //监控文件变化，自动更新
//     // gulp.watch('src/less/*.less', ['less']);
//     // gulp.watch('src/*.html', ['html']);
//     // gulp.watch('src/images/*.*', ['images']);
// });

// gulp.task('default', gulp.series('gulp-rollup', function () {
//     // return gulp.watch('./src/**/*.js', ['script']);
// });

gulp.task('default', build, function () {
    console.log(22);
});

// gulp.task('default', gulp.series('gulp-rollup'), function () {
//     console.log(22);
// });


// 多任务处理
// gulp.task('default', gulp.series('server', function () { // ['server'] 会报错
//   callback属于series, gulp.series需要return gulp流，否则报错
//   return gulp.src()
//   ...
// }));

// gulp.task('default', gulp.series('gulp-rollup'), function () { // default的callback
//     console.log(1889);
// });

// 批量处理
// gulp.src('./src/server/**/*.js')

// 指明处理
// var paths = {
//     scripts: ['src/server/index.js', 'src/server/index2.js'] // 入口和出口
// };
// gulp.src(paths) 

// 需要return gulp.src ...


// gulp-rollup
// https://www.npmjs.com/package/gulp-rollup

// es6转es5
// .pipe(babel({
//     "presets": [
//         [
//             "@babel/preset-env",
//             {
//                 "modules": "umd"
//             }
//         ]
//     ],
//     "plugins": [
//         "@babel/plugin-transform-arrow-functions"
//     ]
// }))
// .pipe(gulp.dest('dist/server'));