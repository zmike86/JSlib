define(function(require, exports, module) {

    var Model = require("../../sogoJS/Model");
    var LocalStorage = require("../../sogoJS/plugins/LocalStorage");
    var TaskModel = new Model("TaskModel", ["name", "done"]);

    // Persist model between page reloads.
    TaskModel.extend(LocalStorage);
    TaskModel.extend({
        // Return all active tasks.
        active: function() {
            return this.select(
                function(item) {
                    return !item.done;
                }
            );
        },

        // Return all done tasks.
        done: function() {
            return this.select(
                function(item) {
                    return !!item.done;
                }
            );
        },

        // Clear all done tasks.
        destroyDone: function() {
            this.done().forEach(
                function(model) {
                    model.destroy()
                }
            );
        }
    });
    
    module.exports = TaskModel;
    
});