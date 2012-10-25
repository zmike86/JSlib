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
 */
;
define(function(require, exports, module) {
    var typeArray = ["Boolean", "Number", "String", "Function", "Array", "Date", "RegExp", "Object"],
        classMap = {},
        i, Type;
    
    for(i = 0; i < typeArray.length; ++i) {
        classMap[ "[object " + typeArray[i] + "]" ] = typeArray[i].toLowerCase();
    }

    Type = function(obj) {
		return obj == null ? 
		    "null" : 
		    (classMap[Object.prototype.toString.call( obj )] || "object");
    };

    Type.isFunction = function(obj) {
	    return this(obj) === "function";
	};

    // # Array.isArray is a new method in ECMA-262
    Type.isArray = Array.isArray || function(obj) {
		return this(obj) === "array";
	};
    
    // # window.window is supposed to be the window.self property
    Type.isWindow = function(obj) {
		return obj != null && obj == obj.window;
	};

    Type.isNumeric = function(obj) {
		return !isNaN(parseFloat(obj)) && isFinite(obj);
	};
    
    module.exports = Type;

});