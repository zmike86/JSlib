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
    
    var create = function ( o ) {
            function F() { }
            F.prototype = o;
            return new F();
        };
    
    var extend = function( target, mixin, force ) {
        var force = !!force;
        for( var n in mixin ) {       
            if( !!target[n] && !force )
                continue;               
            target[n] = mixin[n];     
        }        
    };
    
    var klass = function() { };
    
    
    // extend class static properties or methods
    klass.extend = function( mixinObj, force ) {

        force = ( typeof force == 'boolean' ? force : true );
		extend( this, mixinObj, force );
		
		if( mixinObj.extended ) { 
		
		    mixinObj.extended.apply( this, arguments );
		}        
    };
    
    // extend instancial properties or methods
    klass.include = function( mixinObj, force ) {
        
        force = ( typeof force == 'boolean' ? force : true );
		extend( this.prototype, mixinObj, force );
		
		if( mixinObj.included ) { 
		
		    mixinObj.included.apply( this, arguments );
		}
        
    };    
    
    var inherit = {
        create:function() {
        
            var parent, config;
            
            if( !!arguments[0] ){
                if( typeof arguments[0] == 'function' )
                    parent = arguments[0];
                if( typeof arguments[0] == 'object' )
                    config = arguments[0];    
            }
        
            var F;
            var _proto = create(klass.prototype);
            
            if(!!parent) {
            
                extend( _proto, parent.prototype, true );
                F = function() {            
                    parent.apply( F, arguments );           
                };
                F.prototype = _proto;
                F.prototype.constructor = F;
                // for later invoke
                F.superClass = parent;
                
            } else {
            
                F = function() { };
                F.prototype = _proto;
                F.prototype.constructor = F;
                F.superClass = null;
                
            }
            
            extend( F, klass, true );
            
            if(!!config)
                F.include( config, true );
                                    
            return F;
        
        },
        init:function( config ) {
            
            var instance = new this();
            
            extend( instance, config, true );
            
            return instance;
            
        }             
    };
    
    extend( klass, inherit );    
    //extend( klass.prototype, inherit);
    
    window.Class = klass;

    return klass;

})(window);