/*!
 * Sogou.Inc JavaScript Utility Tools Library v0.1
 * http://www.sogou.com/
 *
 * Author: Leo Zhang 
 * We are here: http://10.13.207.143/wiki/index.php
 * Released under the MIT, GPL Licenses.
 *
 * Usage: PubSub.subscribe("change",this.change,this);
 *        PubSub.publish("change",[]);
 *        PubSub.unsubscribe("change",this.change);
 *
 * Description:
 *     It's a plugin.
 *     The PubSub mechanism maintain a topicMap HASHMAP,
 *     each topic is another map;
 *
 *     {
 *          "UserChange": [fn1, fn2]
 *     }
 *
 * Date: Fri Jul,20th
 * Copyright 2012
 *
 */
;
define(function(require, exports, module) {

    var Array = require("./../lang/Array"),
        PubSub = {
            topicMap:{}
        };
    
    (function() {
        
        this.subscribe = function(topic, fn) {
            var exists;
            if(topic in this.topicMap) {
                // only push the non-exists function
                exists = Array.find(this.topicMap[topic]["subscribers"], function(item, index) {
                    return item === fn;
                });
                if(!exists) {
                    this.topicMap[topic]["subscribers"].push(fn);
                }    
            } else {
                this.topicMap[topic] = {
                    subscribers:[fn]
                }
            }
            
            return this;
        };
        
        this.unsubscribe = function(topic, fn) {
            this.topicMap[topic] && (function() {
                this.topicMap[topic]["subscribers"] = Array.filter(this.topicMap[topic]["subscribers"],function(item){
                    return item !== fn;
                });        
            }).call(this);
            
            return this;
        };
        
        this.publish = function(topic, args) {
            this.topicMap[topic] && (function() {
                var farr = this.topicMap[topic]["subscribers"];
                for(var i=0; i<farr.length; i++) {
                    farr[i].apply(this, args);
                }                
            }).call(this);
            
            return this;
        };
    
    }).call(PubSub);
    
    module.exports = PubSub;

});