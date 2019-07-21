(function () {
    var root = typeof self == 'object' && self.self === self && self || typeof global == 'object' && global.global === global && global || this || {};
    // 判断如果是浏览器或者node环境下, root代表当前系统对象
    var _ = function (obj) {
        if (obj instanceof _) return obj;
        if (!(this instanceof _)) return new _(obj);
        this._wrapped = obj;
    };

    _.map = function () {
        console.log('map');
    };

    _.prototype.map = function () {
        _.map.call(this);
    };

    
    _.functions = function (obj) {
        return Object.keys(obj);
    }

    _.throttle = function (fn, wait = 500) {
        let timer;
        return function (...args) {
            if (!timer) {
                timer = setTimeout(() => {
                    timer = null;
                }, wait);
                return fn.apply(this, args);
            }
        }
    }

    _.each = function (obj, iteratee) {

    };

    // 重点，通过遍历一个对象keys值，重挂载到_下
    _mixin = function (obj) {
        _.each(_.functions(obj), function (name) {
            var func = _[name] = obj[name];
            _.prototype[name] = function () {
                var args = [this._wrapped];
                push.apply(args, arguments);
                return func.apply(_, args);
            };
        });
        return _;
    };

    _mixin(_);

    if (typeof exports != 'undefined' && !exports.nodeType) {
        if (typeof module != 'undefined' && !module.nodeType && module) {
            exports = module.exports = _;    
        } else {
            exports._ = _;
        }
    } else {
        root._ = _;
    }
}());