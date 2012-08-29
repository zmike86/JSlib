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
 * 
 * Description: Aim to provide some new feather of daily use or implement the properties and 
 *              methods of Object Constructor Function of ECMA-262
 *
 */


define("sogo/lang/Object", [ "sogo/Type" ], function( Type ) {

    var O = { };
    
    // Object.create ( O, Properties? )
    //  The create function creates a new object with a specified prototype. When the create function is called, the following steps are taken:
    //  1. If Type(O) is not Object or Null throw a TypeError exception.
    //  2. Let obj be the result of creating a new object as if by the expression new Object() 
    //     where Object is the standard built-in constructor with that name
    //  3. Set the [[Prototype]] internal property of obj to O.
    //  4. If the argument Properties is present and not undefined, add own properties to obj as if by calling the standard 
    //     built-in function Object.defineProperties with arguments obj and Properties.
    //  5. Return obj.
    if( typeof Object.create === 'function' ) {
    
        O.create = Object.create;
    
    } else {
    
        O.create = function ( o, properties ) {
        
            if( Type(o) !== "object" ) 
                throw new Error("TypeError..");

            function F() { }
            F.prototype = o;
            var f = new F();
                            
            if( Type(properties) !== "null" ) {
            
                O.defineProperties( f, properties );
            
            }    
            
            return f;
        };    
    }


    // Object.defineProperty ( O, P, Attributes )
    //  The defineProperty function is used to add an own property and/or update the attributes of an existing own property of an object. 
    //  When the defineProperty function is called, the following steps are taken:
    //  1. If Type(O) is not Object throw a TypeError exception.
    //  2. Let name be ToString(P).
    //  3. Let desc be the result of calling ToPropertyDescriptor with Attributes as the argument.
    //  4. Call the [[DefineOwnProperty]] internal method of O with arguments name, desc, and true.
    //  5. Return O.
    if( typeof Object.defineProperty === 'function' ) {
    
        O.defineProperty = Object.defineProperty;
    
    } else {
        
        O.defineProperty = function ( o, p, properties ) {
        
            if( Type(o) !== "object" ) 
                throw new Error("TypeError..");               
            
			var name = p.toString ? p.toString() : Object.prototype.toString.call(p);
			o[name] = properties;    
            
            return o;   
        };
    
    } 

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
    if( typeof Object.defineProperties === 'function' ) {
    
        O.defineProperties = Object.defineProperties;
    
    } else {
        
        O.defineProperties = function ( o, properties ) {
        
            if( Type(o) !== "object" || Type(properties) !== "object" ) 
                throw new Error("TypeError..");
            
            O.extend( o, properties, true );
            
            return o;   
        };
    
    }    
    
    
    // extend the target Object with the mixin Object, if the force set to be true,
    // it will overwrite the property when the target has own the property also.
    O.extend = function( target, mixin, force ) {
    
        var force = !!force;
    
        for( var n in mixin ) {       
            if( !!target[n] && !force )
                continue;               
            target[n] = mixin[n];     
        }        
    
    };
    
    return O;

});