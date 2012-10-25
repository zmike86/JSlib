/*!
 * Sogou.Inc JavaScript Utility Tools Library v0.1
 * http://www.sogou.com/
 *
 * Author: Leo Zhang 
 * We are here: http://10.13.207.143/wiki/index.php
 * Released under the MIT,GPL Licenses.
 *
 * Date: Mon Aug,20th
 * Copyright 2012
 *
 * Description: 
 *   TRY TO standerd the Dom Event
 */
;
define(function(require, exports, module) {

    // dependence declaration
    var query = require("./Query");
    // variables
    var addEvent,
        removeEvent,
        hooks = ["button", "buttons", "clientX", "clientY", "fromElement", "offsetX", "offsetY", "pageX", "pageY", "screenX", "screenY", "toElement", "keyCode"],
        props = ["attrChange", "attrName", "relatedNode", "srcElement", "altKey", "bubbles", "cancelable", "ctrlKey", "currentTarget", "eventPhase", "metaKey", "relatedTarget", "shiftKey", "target", "timeStamp", "view", "which"],
        copy  = props.concat(hooks);

    // @param  e: dom event
    var Ivent = function(e) {
        this.originalEvent = e;
        this.type = e.type;
        this.timeStamp = e && e.timeStamp || (+new Date().getTime());

        // refer to jQuery.event.fix(event)
        for (i = copy.length; i; ) {
            prop = copy[--i];
            this[prop] = e[prop];
        }
        // Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
        if (!this.target) {
            this.target = e.srcElement || document;
        }

        // Target should not be a text node (#504, Safari)
        if (this.target.nodeType === 3) {
            this.target = this.target.parentNode;
        }

        // For mouse/key events; add metaKey if it's not there (#3368, IE6/7/8)
        if (e.metaKey === undefined) {
            this.metaKey = this.ctrlKey;
        }

        // refer to jQuery.event.fixHooks.filter(event, originalEvent)
        var eventDoc, doc, body,
            button = e.button,
            fromElement = e.fromElement;

        // Calculate pageX/Y if missing and clientX/Y available
        if (this.pageX == null && e.clientX != null) {
            eventDoc = this.target.ownerDocument || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            this.pageX = e.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
            this.pageY = e.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
        }

        // Add relatedTarget, if necessary
        if (!this.relatedTarget && fromElement) {
            this.relatedTarget = (fromElement === this.target ? e.toElement : fromElement);
        }

        // Add which for click: 1 === left; 2 === middle; 3 === right
        // Note: button is not normalized, so don't use it
        if (!this.which && button !== undefined) {
            this.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
        }

    };

    // addEvent removeEvent
    if (!document.addEventListener) {
        addEvent = function (ele, type, fn) {
            ele.attachEvent && ele.attachEvent('on' + type, fn);
        };
        removeEvent = function (ele, type, fn) {
            ele.detachEvent && ele.detachEvent('on' + type, fn);
        };
    } else {
        addEvent = function (ele, type, fn) {
            ele.addEventListener && ele.addEventListener(type, fn, false);
        };
        removeEvent = function (ele, type, fn) {
            ele.removeEventListener && ele.removeEventListener(type, fn, false);
        };
    }
        
    (function() {

        // special event type has no bubble
        var special = {
            ready: {

            },

            load: {
                // Prevent triggered image.load events from bubbling to window.load
                noBubble: true
            },

            focus: {
                delegateType: "focusin"
            },
            blur: {
                delegateType: "focusout"
            },

            beforeunload: {

            }
        };

        // private method
        var dispatch = function (event, elems, selector, type, fn, context, data) {
            var handlerQueue = [],
                i, j, cur,
                evt = new Ivent(event || window.event);

            // set delegateTarget to the dom itself
            evt.delegateTarget = this;

            // Determine handlers that should run if there are delegated events
            // Avoid non-left-click bubbling in Firefox (#3861)
            if (!(evt.button && evt.type === "click")) {
                cur = evt.target;
                while(cur != this) {
                    if(query.matchesSelector(cur, selector)) {
                        handlerQueue.push(cur);
                    }
                    cur = cur.parentNode || this;
                }
            }

            // run delegate method
            for(i = 0; i < handlerQueue.length; i++) {
                evt.currentTarget = handlerQueue[i];
                evt.data = data;
                // pass the custom event object as the unique argument
                ret = fn.apply((context || evt.currentTarget), [evt]);
                if(ret !== undefined) {
                    evt.result = ret;
                    if(ret === false) {
                        evt.preventDefault();
                        evt.stopPropagation();
                    }
                }
            }
        };

        this.on = function(ele, type, fn) {
            addEvent(ele, type, fn);
        };
        
        this.off = function(ele, type, fn) {
            removeEvent(ele, type, fn);
        };

        // like the jquery delegate function, take it easy
        // @param ele:      top scope dom
        // @param selector: 选择器匹配的元素上触发响应
        // @param type:     click as so
        // @param fn:       handler
        // @param context:  context
        // @param data:     data attach to the event
        this.delegate = function(ele, selector, type, fn, context, data) {
            var handler,
                elements,
                evt,
                specialType;
		    if(!!fn) {
                handler = function(e) {
                    evt = e || window.event;
                    elements = query(selector, ele);
			        if(elements.length > 0) {
			            return dispatch.call(handler.ele, evt, elements, selector, type, fn, context, data);
			        }				        
			    };
			    // Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
                handler.ele = ele;

                // If event changes its type, use the special event handlers for the changed type
                specialType = special[type] || {};

                // If selector defined, determine special event api type, otherwise given type
                type = (selector ? specialType.delegateType : specialType.bindType) || type;

			    this.on(ele, type, handler);
		    }	              
        };

        // standardizing methods
        this.prototype.preventDefault = function() {
            if(this.originalEvent.preventDefault) {
                this.originalEvent.preventDefault();                       
            } else {
                this.originalEvent.returnValue = false;
                return false;            
            }
        };

        this.prototype.stopPropagation = function() {
            if(this.originalEvent.stopPropagation) {
                this.originalEvent.stopPropagation();
            } else {
                this.originalEvent.cancelBubble = true;
            }   
        };        
        
    }).call(Ivent);
    
    module.exports = Ivent;
    
});