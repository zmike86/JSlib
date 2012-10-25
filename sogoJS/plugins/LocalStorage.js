/*!
 * Sogou.Inc JavaScript Utility Tools Library v0.1
 * http://www.sogou.com/
 *
 * Author: Leo Zhang 
 * We are here: http://10.13.207.143/wiki/index.php
 *
 * Description:
 *  Plugin for Model to store in the localStorage DB
 *
 * Released under the MIT,GPL Licenses.
 *
 * Date: Mon Jul,16th
 * Copyright 2012
 */
;
define(function(require, exports, module) {

    var JSON, ModelLocal;

    JSON = require("./../JSON");

    // built in plugin
    ModelLocal = {
        callback: function() {
            this.sync && this.sync(this.saveLocal);
            this.fetch && this.fetch(this.loadLocal);
        },
        saveLocal: function(model) {
            localStorage[this.name] = this.toJSON();
        },
        loadLocal: function() {
            var result = localStorage[this.name];
            if (!result)
                return;
            result = JSON.parse(result);
            this.populate(result);
        }
    };
    
    module.exports = ModelLocal;
    
});