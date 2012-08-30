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

define("sogo/lang/Array", [ "sogo/Type" ], function( Type ) {  

    // global hook
    var _array = {     
        // Keep the identity function around for default iterators.
        identity : function(value) {
            return value;
        }   
    };
    // Establish the object that gets returned to break out of a loop iteration.
    // this object points to the function of break keyword.
    // In some loop statements, if the iterator function return the breaker object,
    // the loop would be stopped.
    var breaker = {};
      
    var ArrayProto = Array.prototype, 
        ObjProto = Object.prototype;

    // Create quick reference variables for speed access to core prototypes.
    var slice            = ArrayProto.slice,
        unshift          = ArrayProto.unshift,
        toString         = ObjProto.toString,
        hasOwnProperty   = ObjProto.hasOwnProperty;

    // All ECMA-262 native function implementations that we hope to use
    // are declared here.
    var nativeForEach      = ArrayProto.forEach,
        nativeMap          = ArrayProto.map,
        nativeReduce       = ArrayProto.reduce,
        nativeReduceRight  = ArrayProto.reduceRight,
        nativeFilter       = ArrayProto.filter,
        nativeEvery        = ArrayProto.every,
        nativeSome         = ArrayProto.some,
        nativeIndexOf      = ArrayProto.indexOf,
        nativeLastIndexOf  = ArrayProto.lastIndexOf,
        nativeIsArray      = Array.isArray;
        
    // Handles objects with the built-in `forEach`, arrays, and raw objects.
    // Delegates to **ECMAScript 5**'s native `forEach` if available.
    var each = _array.forEach = _array.each = function(obj, iterator, context) {
        if ( obj == null ) 
            return;
        if ( nativeForEach && obj.forEach === nativeForEach ) {
        
            obj.forEach( iterator, context );
        
        } else if ( obj.length === +obj.length ) {
            
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
    var map = _array.map = function(obj, iterator, context) {
        var results = [];
        
        if (Type(obj) == "null") 
            return results;
            
        if (nativeMap && obj.map === nativeMap) 
            return obj.map(iterator, context);
            
        each(obj, function(value, index, list) {
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
    var some = _array.some = function(obj, iterator, context) {
        iterator || (iterator = _array.identity);
        var result = false;
        
        if (Type(obj) == "null") 
            return result;
        
        if (nativeSome && obj.some === nativeSome) 
            return obj.some(iterator, context);
            
        each(obj, function(value, index, list) {
            if (result || (result = iterator.call(context, value, index, list))) 
                return breaker;
        });
        
        return !!result;
    };    
    
    // Return the first value which passes a truth test.
    _array.find = function(obj, iterator, context) {
        
        var result;
        
        some(obj, function(value, index, list) {
            if (iterator.call(context, value, index, list)) {
                result = value;
                return true;
            }
        });
        
        return result;
    };

    // Return all the elements that pass a truth test.
    // Delegates to **ECMAScript 5**'s native `filter` if available.
    _array.filter = function(obj, iterator, context) {
    
        var results = [];
        
        if (Type(obj) == "null") 
            return results;
        
        if (nativeFilter && obj.filter === nativeFilter) 
            return obj.filter(iterator, context);
        
        each(obj, function(value, index, list) {
            if (iterator.call(context, value, index, list)) 
                results[results.length] = value;
        });
        
        return results;
    };
  
    // Determine whether all of the elements match a truth test.
    // Delegates to **ECMAScript 5**'s native `every` if available.
    // Aliased as `all`.
    _array.every = _array.all = function(obj, iterator, context) {
    
        var result = true;
        
        if (Type(obj) == "null") 
            return result;
        
        if (nativeEvery && obj.every === nativeEvery) 
            return obj.every(iterator, context);
        
        each(obj, function(value, index, list) {
            if (!(result = result && iterator.call(context, value, index, list))) 
                return breaker;
        });
        
        return !!result;
    };
  
    // Shuffle an array.
    // ite's not proper. I tend to shuffle more times
    _array.shuffle = function(obj) {
    
        var shuffled = [], rand;
        
        each(obj, function(value, index, list) {
            rand = Math.floor(Math.random() * (index + 1));
            shuffled[index] = shuffled[rand];
            shuffled[rand] = value;
        });
        
        return shuffled;
    };
    
    _array.indexOf = function(array, item) {
        if (Type(obj) !== "array") 
            return -1;
        
        var i, l;
        
        if (nativeIndexOf && array.indexOf === nativeIndexOf) 
            return array.indexOf(item);
            
        for (i = 0, l = array.length; i < l; i++) 
            if (i in array && array[i] === item) 
                return i;
        
        return -1;
    };

    // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
    _array.lastIndexOf = function(array, item) {
        
        if (Type(obj) !== "array") 
            return -1;
        
        if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) 
            return array.lastIndexOf(item);
        
        var i = array.length;
        while (i--) {
            if (i in array && array[i] === item) 
                return i;
        }
                
        return -1;
    };  
  
    // Is a given value an array?
    // Delegates to ECMA5's native Array.isArray
    _array.isArray = nativeIsArray || function(obj) {
        return Type(obj) == "array";
    };       
    
    return _array;
  
});