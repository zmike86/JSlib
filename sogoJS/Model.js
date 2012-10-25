/*!
 * Sogou.Inc JavaScript Utility Tools Library v0.1
 * http://www.sogou.com/
 *
 * Author: Leo Zhang 
 * We are here: http://10.13.207.143/wiki/index.php
 * Released under the MIT,GPL Licenses.
 *
 * Date: Fri Aug,3rd
 * Copyright 2012
 *
 */
;
define(function(require, exports, module) {

    // dependence declaration
    var Class    = require("./lang/Class"),
        object   = require("./lang/Object"),
        type     = require("./Type"),
        inherits = require("./lang/Inherits"),
        JSON     = require("./JSON"),
        PubSub   = require("./plugins/PubSub");
    
    // from Spine.js
    var GUID = function() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, 
                v = (c == "x" ? r : (r & 0x3 | 0x8));
            return v.toString(16);
        }).toUpperCase();
    };

    var SingleModel, Model;

    SingleModel = Class.create({

        newRecord: true,

        initialize: function(attr) {
            if(attr)
				this.load(attr);
        },

		// generates self-described model
		load: function(attr) {
            var pro;
			for(pro in attr) {
				this[pro] = attr[pro];
			}	
		},

		// this method always be overwrite
		validate: function() {
			return false;
		},
		// 返回最初的model属性哈希
		attributes: function() {
			var result = {}, i;
			for(i in this.parent.attributes) {
				var attr = this.parent.attributes[i];
				result[attr] = this[attr];
			}
			result.id = this.id;
			return result;
		},

		equal: function(model) {
		    return(model && model.id === this.id && model.parent === this.parent);
		},

		_create: function() {
		    this.trigger("beforeCreate");
		    if(!this.id)
                this.id = GUID();
		    this.newRecord = false;
		    this.parent.models[this.id] = this;
		    this.trigger("create");
		},

		_update: function() {
		    this.trigger("beforeUpdate");
			this.parent.models[this.id] = this;
			this.trigger("update");
		},

		save: function() {
		    var error = this.validate();
		    if(error) {
				this.trigger("error", error);
			    throw {
                    name: "error",
                    message: "Validation failed: " + error
                };
		    }
		    this.trigger("beforeSave");
		    this.newRecord ? this._create() : this._update();
		    this.trigger("save");
		},

		destroy: function() {
		    this.trigger("beforeDestroy");
			delete this.parent.models[this.id];
			this.trigger("destroy");
		},

		toJSON: function() {
            debugger;
			return this.attributes();
		},

		updateAttribute: function(name, value) {
			this[name] = value;
			return this.save();
		},

		updateAttributes: function(attr) {
			this.load(attr);
			return this.save();
		},

		bind: function(ev, callback) {
            var me = this;
			this.parent.subscribe(ev, function(model){
				if(model && me.equal(model))
                    callback.apply(me, arguments);
			});
		},

		trigger: function(ev, data) {
            var me = this;
            this.parent.publish(ev, [data || me]);
		}    
    });

    // var ContactModel = new Model('user', ['name','age','agenda']);
    // Model have 6 basic events:
    //  create, update, destroy, refresh, fetch and change;
    Model = Class.create({

		initialize: function(name, attr) {
			this.models = {};
			this.name = name;
			this.attributes = attr ? attr : [];

            object.extend(this, inherits);
			this.extend(PubSub);
            // priority trigger 'change' event
            // when CRUD occurs
			this.subscribe("create", function(model) {
				this.publish("change", [model]);
			});
			this.subscribe("update", function(model) {
				this.publish("change", [model]);			
			});
			this.subscribe("destroy", function(model) {
				this.publish("change", [model]);
			});
		},

		create: function(attr) {
            var model = this.init(attr);
			model.save();
			return model;
        },

		update: function(id, attr) {
            this.find(id).updateAttributes(attr);
        },

		destroy: function(id) {
            this.find(id).destroy();
        },

        populate: function(values) {
            var i, il, model;
            this.models = {};
            for (i=0, il=values.length; i<il; i++) {
                model = this.init(values[i]);
                model.newRecord = false;
                this.models[model.id] = model;
            }

            this.publish("refresh");
        },

        deleteAll: function() {
            // no event triggered
            var key;
            for (key in this.models)
				delete this.models[key];
        },

		destroyAll: function() {
            // 'destroy' event triggered
            var key;
            for (key in this.models)
				this.models[key].destroy();
        },

        // bind the synchronize callback to 'change' event
		// avoid to expose the direct interface to programmer
        sync: function(callback) {
            this.subscribe("change", callback);
        },

        // fetch data from server side or localStorage
        fetch: function(callback) {
            callback ? this.subscribe("fetch", callback) : this.publish("fetch");
        },

        // utilities methods below

        find: function(id) {
            var model = this.models[id];
            var result;
            result = model ? model : null;
            return result;
        },

        findByAttribute: function(name, value) {
            var key, result = null;
            for (key in this.models) if (this.models[key][name] == value) {
                result = this.models[key];
                break;
            }
            return result;
        },

        findAllByAttribute: function(name, value) {
            return this.select(function (item) {
                return(item[name] == value);
            });
        },

        exists: function(id) {
            var model = this.models[id];
            return (model ? true : false);
        },

        each: function(callback) {
            var key;
            for (key in this.models)
                callback(this.models[key]);
        },

        select: function(callback) {
            var result = [], key;
            for (key in this.models) {
                if (callback(this.models[key]))
                    result.push(this.models[key]);
            }
            return result;
        },

        toJSON: function() {
            return JSON.stringify(this.makeArray());
        },

        makeArray: function() {
            var result = [], key;
			for (key in this.models)
				result.push(this.models[key]);
			return result;
        },

		init: function(attr) {
            var instance = new SingleModel(attr);
			instance.parent = this;
            return instance;
		}         
	});
    
    module.exports = Model;
    
});