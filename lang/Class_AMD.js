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
 * Usage: var Panel = Class.create( null?, instanceConfigObject);
 *        var panel = Panel.init( configurationObject? );   
 *        var EditPanel = Class.create( Panel?, instanceConfigObject);
 *        var textEditor = EditPanel.init( configurationObject? );  
 * 
 * Description: At present, it only suppports single inheritence, Just like Java and C#.
 *              You must deliver only one constructor function to the Class.create method as the first argument.
 *              For including other functionality, you can use the Class.include or Class.extend method 
 *              to mixin other functional modules. 
 *
 */

define("sogo.lang.Class", [ "sogo.Type", "sogo.lang.Object" ], function( Type, Object ) {         
    
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
		Object.extend( this.prototype, mixinObj, force );
		
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
        Object.extend( F, klass, true );
        F.extend( inherits );
        
        F.include({
            // avoid non initialize method in the init's arguments
            // default to invoke superClass's same method
            initialize: function() { 
                if( this.constructor.superClass ){
                    this.constructor.superClass.prototype.initialize.apply( this, arguments);
                }
            },
            uper: function(){
            
                var func = arguments[0];
                var args = arguments.callee.caller.arguments.length > 1 ? 
                            [].slice.apply(arguments.callee.caller.arguments,[1]) : 
                            arguments.callee.caller.arguments;
                var funList = [];
                
                var constructor = this.constructor;
                while(constructor.superClass){
                    var pro = constructor.superClass.prototype;
                    if(!!pro[func]) {
                        funList.push(pro[func]);
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
                   
    
    return klass;

});