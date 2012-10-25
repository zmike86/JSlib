/*!
 * Sogou.Inc JavaScript Utility Tools Library v0.1
 * http://www.sogou.com/
 *
 * Author: Leo Zhang 
 * We are here: http://10.13.207.143/wiki/index.php
 * Released under the MIT,GPL Licenses.
 *
 * Date: Fri Jul,20th
 * Copyright 2012
 *
 * Usage: var Panel = Class.create( null?, instanceConfigObject );
 *        var panel = new Panel( configurationObject? );
 *        var EditPanel = Class.create( Panel?, instanceConfigObject );
 *        var textEditor = new EditPanel( configurationObject? );
 *
 *          如果传递instanceConfigObject,里面最好需要包含一个initialize方法作为实例化对象时自动调用.
 *          参数后带?代表可选
 *  
 * 
 * Description: 时刻要铭记一点,继承的最终目的是代码复用,不要为了继承而继承,不要为了模拟而模拟,js是非常独特的语言,没必要模拟成java,
 *              要用js写代码的人请忘记java和C#...
 *              可以扩展或称mixin其他模块,每个构造函数都有extend和include两个方法,分别用来mixin静态和实例方法.
 *              形参都是一个配置对象
 *
 */
;
define(function(require, exports, module) {

    var type, object, inherits, Class, proxyModule, slice;

    // 声明依赖
    type     = require("../Type");
    object   = require("./Object");
    inherits = require("./Inherits");
    Class    = {};
    slice    = Array.prototype.slice;

    // 提供了代理方法绑定当前对象为方法上下文
    proxyModule = {
        proxy: function(fn) {
            var me = this;
            return (function() {
                return fn.apply(me, arguments);
            });
        },
        proxyAll: function() {
            var func;
            for (var i = 0; i < arguments.length; i++) {
                func = arguments[i];
                this[func] = this.proxy(this[func]);
            }
        }
    };
    
    // Class对象唯一的方法create
    // @param ParentClass指定继承自的父类构造器
    // @param PropObj显示声明类实例方法
    Class.create = function(ParentClass, PropObj) {
        var parent,
            ChildClass,
            config;

        ChildClass = function() {
            var su = ChildClass.uber, i,
                fs = [];
            // 构造器执行父类的构造函数
            while(su && su.hasOwnProperty("initialize")) {
                fs.push(su.initialize);
                su = su.constructor.uber;
            }
            for(i = fs.length; i--;) {
                fs[i].apply(this,arguments);
            }
            if(ChildClass.prototype.hasOwnProperty("initialize")) {
                ChildClass.prototype.initialize.apply(this,arguments);
            }
        };

        // 取得父类及实例方法
        if(type.isFunction(ParentClass)) {
            parent = ParentClass;
            config = PropObj || {};
        } else if(type(ParentClass) === "object") {
            parent = Object;
            config = ParentClass || {};
        } else {
            parent = Object;
            config = {};
        }
        
        return (function() {
            // 原型继承父类
            this.prototype = object.create(parent.prototype);
            // 保存父类原型引用
            this.uber = parent.prototype;
            this.prototype.constructor = this;

            object.extend(this, inherits, true);
            this.extend(proxyModule);
            // 扩展实例方法
            this.include(proxyModule).include(config, true).include({
                // 父类方法调用,简单起见,必须指定调用的方法名称
                base: function(method) {
                    var args = slice.call(arguments, 1);
                    if (type(method) === "string" && this.constructor.uber[method]) {
                        return this.constructor.uber[method].apply(this, args);
                    }
                }
            });
            
            return this;
            
        }).call(ChildClass);
    
    };
    
    module.exports = Class;

});