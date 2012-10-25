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
 * Usage: 
 *        I think it's very necessary to merge some lightweight unit has been defined or provided.   
 * 
 * Description: 
 *        Mainly extend the Array module realize the ECMA262 5's new feather         
 *
 */
;
define(function(require, exports, module) {
    var type = require("../Type");
    // global hook
    var array = {     
        // Keep the identity function around for default iterators.
        identity: function(value) {
            return value;
        }   
    };
    // Establish the object that gets returned to break out of a loop iteration.
    // this object points to the function of break keyword.
    // In some loop statements, if the iterator function return the breaker object,
    // the loop would be stopped.
    var breaker = {};
      
    var ArrayProto         = Array.prototype,
        ObjProto           = Object.prototype,
        slice              = ArrayProto.slice,
        unshift            = ArrayProto.unshift,
        toString           = ObjProto.toString,
        hasOwnProperty     = ObjProto.hasOwnProperty,
        nativeForEach      = ArrayProto.forEach,
        nativeMap          = ArrayProto.map,
        nativeReduce       = ArrayProto.reduce,
        nativeReduceRight  = ArrayProto.reduceRight,
        nativeFilter       = ArrayProto.filter,
        nativeEvery        = ArrayProto.every,
        nativeSome         = ArrayProto.some,
        nativeIndexOf      = ArrayProto.indexOf,
        nativeLastIndexOf  = ArrayProto.lastIndexOf,
        nativeIsArray      = Array.isArray;
        
    (function() {
        // Handles objects with the built-in `forEach`, arrays, and raw objects.
        // Delegates to **ECMAScript 5**'s native `forEach` if available.    
        this.each = this.forEach = function(obj, iterator, context) {
            if (obj == null) 
                return;
            if (nativeForEach && obj.forEach === nativeForEach) {            
                obj.forEach(iterator, context);            
            } else if (obj.length === +obj.length) {                
                for (var i = 0, l = obj.length; i < l; i++) {
                    if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) 
                        return;
                }                
            } else {                
                for (var key in obj) {
                    if ( hasOwnProperty.call(obj, key) ) {
                        if (iterator.call(context, obj[key], key, obj) === breaker) 
                            return;
                    }
                }                
            }            
        };
        // Return the results of applying the iterator to each element.
        // Delegates to **ECMAScript 5**'s native `map` if available.        
        this.map = function(obj, iterator, context) {
            var results = [];           
            if (type(obj) == "null")
                return results;                
            if (nativeMap && obj.map === nativeMap) 
                return obj.map(iterator, context);    
                            
            this.each(obj, function(value, index, list) {
                results[results.length] = iterator.call(context, value, index, list);
            });            
            // special length property should be added
            if (obj.length === +obj.length) 
                results.length = obj.length;
            
            return results;        
        };
        // Determine if at least one element in the object matches a truth test.
        // Delegates to **ECMAScript 5**'s native `some` if available.
        // Only one item will be returned at most.        
        this.some = function(obj, iterator, context) {
            iterator || (iterator = this.identity);
            var result = false;            
            if (type(obj) == "null")
                return result;
            
            if (nativeSome && obj.some === nativeSome) 
                return obj.some(iterator, context);
                
            this.each(obj, function(value, index, list) {
                if (result || (result = iterator.call(context, value, index, list))) 
                    return breaker;
            });
            
            return !!result;        
        };
        // Return the first value which passes a truth test.
        this.find = function(obj, iterator, context) {
            var result;            
            this.some(obj, function(value, index, list) {
                if(iterator.call(context, value, index, list)) {
                    result = value;
                    return true;
                }
            });
            
            return result;        
        };
        // Return all the elements that pass a truth test.
        // Delegates to **ECMAScript 5**'s native `filter` if available.        
        this.filter = function(obj, iterator, context) {
            var results = [];           
            if (type(obj) == "null")
                return results;
            
            if (nativeFilter && obj.filter === nativeFilter) 
                return obj.filter(iterator, context);
            
            this.each(obj, function(value, index, list) {
                if (iterator.call(context, value, index, list)) 
                    results[results.length] = value;
            });
            
            return results;        
        };       
        // Determine whether all of the elements match a truth test.
        // Delegates to **ECMAScript 5**'s native `every` if available.
        // Aliased as `all`.
        this.every = this.all = function(obj, iterator, context) {       
            var result = true;           
            if (type(obj) == "null")
                return result;            
            if (nativeEvery && obj.every === nativeEvery) 
                return obj.every(iterator, context);
            
            this.each(obj, function(value, index, list) {
                if (!(result = result && iterator.call(context, value, index, list))) 
                    return breaker;
            });
            
            return !!result;
        };        
        // Shuffle an array.
        // ite's not proper. I am tend to shuffle more times
        this.shuffle = function(obj) {        
            var shuffled = [], 
                rand;            
            this.each(obj, function(value, index, list) {
                rand = Math.floor(Math.random() * (index + 1));
                shuffled[index] = shuffled[rand];
                shuffled[rand] = value;
            });
            
            return shuffled;
        };
        // search in an array with the given item
        this.indexOf = function(obj, item) {
            if (type(obj) !== "array")
                return -1;
            
            var i, l;            
            if (nativeIndexOf && obj.indexOf === nativeIndexOf) 
                return obj.indexOf(item);
                
            for (i = 0, l = obj.length; i < l; i++) 
                if (i in obj && obj[i] === item) 
                    return i;
            
            return -1;
        };
        // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
        this.lastIndexOf = function(obj, item) {            
            if (type(obj) !== "array")
                return -1;
            
            if (nativeLastIndexOf && obj.lastIndexOf === nativeLastIndexOf) 
                return obj.lastIndexOf(item);
            
            var i = obj.length;
            while(i--) {
                if(i in obj && obj[i] === item)
                    return i;
            }
                    
            return -1;
        };

        this.isArray = nativeIsArray || function(obj) {
            return type(obj) == "array";
        };  
                
    }).call(array);           
    
    module.exports = array;
  
});