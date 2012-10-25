/*!
 * Sogou.Inc JavaScript Utility Tools Library v0.1
 * http://www.sogou.com/
 *
 * Author: Leo Zhang 
 * We are here: http://10.13.207.143/wiki/index.php
 * Released under the MIT,GPL Licenses.
 *
 * Usage: var newObj = Object.clone({name:'zhangshen'},true);
 *        var newObj = Object.create(Parent.prototype);
 *
 * Description: provides some new feather, which defined in Object Constructor Function of ECMA-262
 *
 * Date: Sun Aug,5th
 * Copyright 2012
 *
 */
;
define(function(require, exports, module) {
    var type = require("../Type"),
        O = {};
    var toString         = Object.prototype.toString,
        hasOwnProperty   = Object.prototype.hasOwnProperty,
        nativeKeys       = Object.keys,
        nativeCreate     = Object.create,
        nativeDefinePros = Object.defineProperties,
        nativeDefinePro  = Object.defineProperty;
    
    // Object.create ( O, Properties? )
    //  The create function creates a new object with a specified prototype. When the create function is called, the following steps are taken:
    //  1. If Type(O) is not Object or Null throw a TypeError exception.
    //  2. Let obj be the result of creating a new object as if by the expression new Object() 
    //     where Object is the standard built-in constructor with that name
    //  3. Set the [[Prototype]] internal property of obj to O.
    //  4. If the argument Properties is present and not undefined, add own properties to obj as if by calling the standard 
    //     built-in function Object.defineProperties with arguments obj and Properties.
    //  5. Return obj.
    O.create = nativeCreate || function(obj, properties) {
        var f,
            F = function(){};
        if(type(obj) !== "object") {
            throw new TypeError("TypeError..");
        }
        F.prototype = obj;
        f = new F();

        //if(type(properties) !== "null") {
        //    O.defineProperties(f, properties);
        //}

        return f;
    };


    // Object.defineProperty ( O, P, Attributes )
    //  The defineProperty function is used to add an own property and/or update the attributes of an existing own property of an object. 
    //  When the defineProperty function is called, the following steps are taken:
    //  1. If Type(O) is not Object throw a TypeError exception.
    //  2. Let name be ToString(P).
    //  3. Let desc be the result of calling ToPropertyDescriptor with Attributes as the argument.
    //  4. Call the [[DefineOwnProperty]] internal method of O with arguments name, desc, and true.
    //  5. Return O.        
    O.defineProperty = nativeDefinePro || function(obj, p, properties) {
        if(type(obj) !== "object")
            throw new TypeError("TypeError..");               
        
		var name = p.toString ? p.toString() : toString.call(p);
		obj[name] = properties;    
        
        return obj;   
    };

    // Object.defineProperties ( O, Properties )
    //  The defineProperties function is used to add own properties and/or update the attributes of existing own properties of an object. 
    //  When the defineProperties function is called, the following steps are taken:
    //  1. If Type(O) is not Object throw a TypeError exception.
    //  2. Let props be ToObject(Properties).
    //  3. Let names be an internal list containing the names of each enumerable own property of props.
    //  4. Let descriptors be an empty internal List.
    //  5. For each element P of names in list order,
    //      a. Let descObj be the result of calling the [[Get]] internal method of props with P as the argument.
    //      b. Let desc be the result of calling ToPropertyDescriptor with descObj as the argument.
    //      c. Append the pair (a two element List) consisting of P and desc to the end of descriptors.
    //  6. For each pair from descriptors in list order,
    //      a. Let P be the first element of pair.
    //      b. Let desc be the second element of pair.
    //      c. Call the [[DefineOwnProperty]] internal method of O with arguments P, desc, and true.
    //  7. Return O.
    //  If an implementation defines a specific order of enumeration for the for-in statement, 
    //  that same enumeration order must be used to order the list elements in step 3 of this algorithm.          
    O.defineProperties = nativeDefinePros || function(obj, properties) {
    
        if( type(obj) !== "object" || type(properties) !== "object" )
            throw new TypeError("TypeError..");
        
        O.extend(obj, properties, true);
        
        return obj;   
    };


    // extend the target Object with the mixin Object, if the force set to be true,
    // it will overwrite the property when the target has own the property also.
    O.extend = function(target, mixin, force) {
        var attr,
            isIn;
        for(attr in mixin) {
            if(hasOwnProperty.call(mixin, attr)) {
                isIn = hasOwnProperty.call(target, attr);
                if((isIn && !!force) || !isIn) {
                    target[attr] = mixin[attr];
                }
            }
        }
    };
    
    // Object.keys ( O )
    //  When the keys function is called with argument O, the following steps are taken:
    //  1. If the Type(O) is not Object, throw a TypeError exception.
    //  2. Let n be the number of own enumerable properties of O
    //  3. Let array be the result of creating a new Object as if by the expression new Array(n) where Array is the standard built-in constructor with that name.
    //  4. Let index be 0.
    //  5. For each own enumerable property of O whose name String is P
    //      a. Call the [[DefineOwnProperty]] internal method of array with arguments ToString(index), the PropertyDescriptor {[[Value]]: P, [[Writable]]: true, [[Enumerable]]: true, [[Configurable]]: true}, and false.
    //      b. Increment index by 1.
    //  6. Return array.
    //  If an implementation defines a specific order of enumeration for the for-in statement, that same enumeration order must be used in step 5 of this algorithm.          
    O.keys = nativeKeys || function(obj) {
        var keys = [],
            key;
        if (type(obj) !== "object")
            throw new TypeError('Invalid object');

        for (key in obj) {
            if (hasOwnProperty.call(obj, key))
                keys[keys.length] = key;
        }
        return keys;
    };
 
    // Return the number of elements in an object.
    O.size = function(obj) {
        return O.keys(obj).length;        
    };
    
    
	// shadow clone OR deep clone
    O.clone = function(src, deep) {
        var target = {};
		var name, copy, clone, copyIsObject,
			source = src || {},
			deepCopy = false;

		// shadow OR deep?
		if (type(deep) === "boolean") {
			deepCopy = deep;
		}

		// clone the source object
		for(name in source) {
			copy = source[name];
			// 避免循环复制
			if (target === copy || !copy) {
				continue;
			}
			// 哈希和数组是两个特殊类型,为了避免潜复制,需要递归调用
			if (deepCopy && (type.isArray(copy) || (copyIsObject = (type(copy) === "object")))) {
				if (copyIsObject) {
					clone = {};				    
				} else {
				    clone = [];			    				    
				}
				// Never move original objects, clone them
				target[name] = clone = this.clone(copy, deepCopy);
			} else {
				target[name] = copy;
			}
		}
        return target;    
    };
    
    module.exports = O;

});