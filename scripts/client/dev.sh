# module方式打包，modules使用module或者nomodule，新浏览器支持type=module直接使用es6，nomodule打包打成es5最后会与module做两次打包兼容使用以支持module但不支持nomodule的浏览器
webpack --NODE_ENV dev --modules module
# webpack-dev-server --NODE_ENV dev --modules module --open