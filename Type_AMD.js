/*!
 * Sogou.Inc JavaScript Utility Tools Library v0.1
 * http://www.sogou.com/
 *
 * Author: Leo Zhang 
 * We are here: http://10.13.207.143/wiki/index.php
 * Released under the GPL Licenses.
 *
 * Date: Fri Jul,20th
 * Copyright 2012
 *
 * Usage: var type = Type( o ); 
 *        result is among [boolean|number|string|function|array|date|regexp|object|null|undefined];  
 *        Also, Type.isFunction( o ) returns a boolean value to indicate weather object o is a function or not,
 *        as well as isNumeric, isArray or others.  
 *   
 * Description: For Type detection. 
 *
 */

define("sogo/Type", function() {

    var typeArray = ["Boolean", "Number", "String", "Function", "Array", "Date", "RegExp", "Object"];
    var classMap = { };
    
    for( var i = 0; i < typeArray.length; ++i ) {
    
        classMap[ "[object " + typeArray[i] + "]" ] = typeArray[i].toLowerCase();
    }

    var T = function( obj ) { 
    
		return obj == null ? 
		    "null" : 
		    ( classMap[ Object.prototype.toString.call( obj ) ] || "object" );        
    
    };
     
	T.isFunction = function( obj ) {
	    return this(obj) === "function";
	};

    // # Array.isArray is a new method in ECMA-262
	T.isArray = Array.isArray || function( obj ) {
		return this(obj) === "array";
	};
    
    // # window.window is supposed to be the window.self property
	T.isWindow = function( obj ) {
		return obj != null && obj == obj.window;
	};

	T.isNumeric = function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	};
    
    return T;

});