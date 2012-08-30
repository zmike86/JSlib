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
 * Usage: var Panel = Class.create( *null, instanceConfigObject);
 *        var panel = Panel.init( defaultPropertyObject );   
 *        var EditPanel = Class.create( Panel, instanceConfigObject);
 *        var textEditor = EditPanel.init( defaultPropertyObject );  
 * 
 * Description: At present, it only suppports single inheritence, Just like Java and C#.
 *              You must deliver only one constructor function to the Class.create method as the first argument.
 *              For including other functionality, you can use the Class.include or Class.extend method 
 *              to mixin other functional modules. 
 *
 */

(function(window, undefined){
 
     Object.create = function ( o ) {

        function F() { }
        F.prototype = o;
        var f = new F();
        
        return f;
    };  
        
    Object.extend = function( target, mixin, force ) {
    
        var force = !!force;
    
        for( var n in mixin ) {       
            if( !!target[n] && !force )
                continue;               
            target[n] = mixin[n];     
        }        
    
    };        
        
    
    var klass = { };
        
    // extend class static properties or methods
    klass.extend = function( mixinObj, force ) {

        force = ( typeof force == 'boolean' ? force : true );
		Object.extend( this, mixinObj, force );
		
		// callbacks
		if( mixinObj.extended ) { 
		
		    mixinObj.extended.apply( this, arguments );
		}        
    };
    
    // extend instancial properties or methods
    klass.include = function( mixinObj, force ) {
        
        force = ( typeof force == 'boolean' ? force : true );
    
        for( var n in mixinObj ) {       
            if( n in this.prototype ) {
                if( !force ) {
                    continue;
                } else {
                    this.prototype[n] = mixinObj[n];
                    this.prototype[n]["_base_name"] = n.toString();   
                }
            } else
                this.prototype[n] = mixinObj[n];
        }  

		
		// callbacks
		if( mixinObj.included ) { 
		
		    mixinObj.included.apply( this, arguments );
		}
        
    };    
    
    
    klass.create = function() {
            
        // get the superClass and instancial properties or methods
        var parent, config;
        
        if( !!arguments[0] ){
            if( typeof arguments[0] == 'function' ) {
                parent = arguments[0];
                config = arguments[1];
            
            } else if( typeof arguments[0] == 'object' ) {
                parent = null;
                config = arguments[0];                    
            }    
        }
    
        var F = function() {            
                // instantiate invoke use the config object
                this.base("initialize",arguments);
                this.initialize.apply( this, arguments );                              
            }, 
            _proto = {};
        
        if(!!parent) {
            // prototypal inheritence
            _proto = Object.create(parent.prototype);                
            F.prototype = _proto;
            F.prototype.constructor = F;
            // for later invoke
            F.superClass = parent;
            
        } else {
            F.superClass = null;                
        }
        
        // add all the static properties and methods 
        // extend and include method will be available
        Object.extend( F, klass, true);
        F.extend( inherits );

        // avoid non initialize method in the init's arguments
        // default to invoke superClass's same method
        // but it's not necessary, because we must define a initialize method        
        F.include({
            initialize: function() { 
                
                this.base("initialize",arguments);
            },
            base: function( method, args ){
            
                var func,
                    i = dep = 0,
                    funList = [];
                if( typeof method === "string" ) {
                    ++i;
                    func = method;
                    args = arguments[i] ?  arguments[i] : [].slice.apply( arguments.callee.caller.arguments, [1] );
                } else {               
                    func = arguments.callee.caller["_base_name"];
                    args = args ? args : [];
                }           
                
                var constructor = this.constructor;
                if(!!func && (func !== "initialize") && constructor.superClass) {
                    var pro = constructor.superClass.prototype;
                    if(!!pro[func]) {                        
                        funList.push(pro[func]);
                        dep--;
                    }
                }
 
                while(dep >= 0 && constructor.superClass){
                    var pro = constructor.superClass.prototype;
                    if(!!pro[func]) {
                        funList.push(pro[func]);
                        dep++;
                    }
                    constructor = constructor.superClass;
                }
                
                for(var j=funList.length-1; j>=0; j--) {
                    funList[j].apply( this, args );
                }
                                
            }           
        });            
        
        // all the fields and methods will be added to the prototype of current Class
        if(!!config)
            F.include( config, true );
                                
        return F;
    
    };
    
    var inherits = {
        init:function( config ) {
        
            var instance = new this( config );            
            return instance;            
        }
    };
                   
    
    window.Class = klass;

})(window);