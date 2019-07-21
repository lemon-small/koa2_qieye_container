// 编译src/server, 生成到dist
var gulp = require('gulp');
var replace = require('rollup-plugin-replace'); // 实现rollup编译时将环境变量注入，实现流清洗
console.log('gulpfile NODE_ENV:', process.env.NODE_ENV);
var env = process.env.NODE_ENV; // 环境变量
console.log('env------------', env);
var rollup = require('gulp-rollup'); // 处理最终需要的主要入口文件，其他文件为引入
var path = require('path');
var watch = require('gulp-watch');
var babel = require('gulp-babel');

// var uglify = require('gulp-uglify');
// var concat = require('gulp-concat');

var entry = './src/server/**/*.js';
var buildDev = function () { // 这个就是gulp.task
    return watch(entry, {ignoreInitial: false}, function () {
        gulp.src(entry)
        .pipe(rollup({
            input: './src/server/local_app.js', // 执行rollup的入口文件
            format: 'umd', // 或cjs
            plugins: [
                replace({ // 清洗变量
                    'process.env.NODE_ENV': JSON.stringify(env)
                })
            ]
        }))
        // es6转es5
        .pipe(babel({
            babelrc: false,
            "presets": [
                [
                    "@babel/preset-env",
                    {
                        "modules": "umd"
                    }
                ]
            ],
            "plugins": [ // 以下是自己引的插件，以下可以直接使用新的：@babel/plugin-transform-modules-commonjs
                "@babel/plugin-transform-runtime",
                "@babel/plugin-transform-arrow-functions"
            ]
        }))
        .pipe(gulp.dest('dist'));
    });
};

var buildProd = function () {
    return gulp.src(entry)
    .pipe(rollup({
        input: './src/server/local_app.js', // 执行rollup的入口文件
        format: 'umd', // 或cjs
        plugins: [
            replace({ // 清洗变量
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
};

// var cleanConfig = function () {
//     return;
// };

if (env === 'dev') {
    build = gulp.series(buildDev);
} else if (env === 'prod') {
    build = gulp.series(buildProd);
}

gulp.task('default', build, function () {
    console.log(22);
});