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
 * Usage: 
 * Description: 
 *    控制器基类，create方法会生成控制器实例。
 *    控制器的作用之一就是将事件handler绑定到相应的Dom元素、Model以及模板上。
 *
 *    理论上一个控制器应该仅对应于一个View，这个View的dom元素将会设置在控制器的ele属性上，ele属性是必须的。
 *    同时，其他相关的dom元素也会被缓存下来，保存在控制器的相应属性里。这是通过一个elements映射来完成的，
 *    eleMap对象中的key代表一个名称作为控制器的属性，value代表一个css选择器，对应的元素会作为控制器的属性。
 *    
 *    控制器还有一个evtArr的属性，用于绑定相应的dom事件，并保证执行上下文为控制器实例。
 *    evtArr中的对象属性name代表事件名称，如click,dbclick；
 *                   属性selector代表相应的css选择器，选择范围会在ele元素内；
 *                   属性method代表事件句柄，通常为控制器的方法；
 *                   属性context代表句柄执行时的上下文，默认不存在即为控制其本身。
 *
 *    css选择器依赖于Query模块  
 *
 */
;
define(function(require, exports, module) {

    // dependence declaration
    var Class  = require("./lang/Class"),
        Array  = require("./lang/Array"),
        PubSub = require("./plugins/PubSub"),
        Event  = require("./Event"),
        query  = require("./Query");

    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var Controller = Class.create({

        ele: null, // view container
        tag: 'div',
        config: null,
        
        initialize: function(config) {
            var key;
            this.config = config;
            for(key in this.config) {
                if(hasOwnProperty.call(this.config, key))
                    this[key] = this.config[key];
            }
          
            if(!this.ele)
                this.ele = document.createElement(this.tag);
          
            this.evtArr = this.evtArr || [];
            this.eleMap = this.eleMap || {};
          
            this.delegateEvents();
            this.mapElementsToAttr();

            if(this.proxied) {
                this.proxyAll.apply(this, this.proxied);
            }
        },

        delegateEvents: function() {
            Array.each(this.evtArr, function(item, index) {
                var method     = item["method"],
                    context    = item["context"] || this,
                    eventType  = item["eventType"], 
                    selector   = item["selector"];

                selector ? Event.delegate(this.ele, selector, eventType, this[method], context) :
                    Event.on(this.ele, eventType, this[method]);
            }, this);
        },

        mapElementsToAttr: function() {
            var key;
            for (key in this.eleMap) {
                if(hasOwnProperty.call(this.eleMap, key))
                    this[key] = query(this.eleMap[key], this.ele)[0];
            }
        },

        delay: function(func, timeout) {
            var me = this;
            setTimeout(function() {
                func.apply(me, arguments);
            }, timeout || 0);
        }

    });
    
	// ensure every Controller has ability to pub & sub
    Controller.extend(PubSub);
	Controller.include(PubSub);
    
    module.exports = Controller;

});