/**
 * Created with JetBrains WebStorm.
 * User: Leo
 * Date: 12-10-8
 * Time: 下午11:50
 * 提供了用于扩展静态方法的extend和用于扩展实例方法的include
 */
;
define(function(require, exports, module) {
    var object = require("./Object");

    var Inherits = {
        // extend class static properties or methods
        extend: function(mixinObj, force) {
            object.extend(this, mixinObj, !!force);
            if(mixinObj.callback) {
                mixinObj.callback.call(this);
            }
            return this;
        },
        // extend instance properties or methods
        include: function(mixinObj, force) {
            object.extend(this.prototype, mixinObj, !!force);
            if(mixinObj.callback) {
                mixinObj.callback.call(this);
            }
            return this;
        }
    };

    module.exports = Inherits;
});