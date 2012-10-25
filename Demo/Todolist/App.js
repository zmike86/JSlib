define(function(require, exports, module) {

      var Query = require("./../../sogoJS/Query"),
          Controller = require("./../../sogoJS/Controller"),
          TaskModel = require("./TaskModel"),
          TaskController = require("./TaskController");

      var TaskApp = new Controller({
          ele: document.getElementById("tasks"),
          proxied:["renderCount", "addOne", "addAll"],

          evtArr: [{
              method:"create",
              eventType:"submit",
              selector:"form"
            },{
              method:"clear",
              eventType:"click",
              selector:".clear"
          }],

          eleMap: {
              "items": ".items",
              "count": ".countVal",
              "clearAll": "a.clear",
              "input": "form input"
          },

          // 控制器初始化函数
          init: function(){
              TaskModel.subscribe("create",  this.addOne);
              TaskModel.subscribe("refresh", this.addAll);
              TaskModel.subscribe("refresh", this.renderCount);
              TaskModel.subscribe("change", this.renderCount);
              TaskModel.fetch();
          },

          // model event handlers
          addOne: function(task) {
              var view = TaskController.init(task);
              this.items.appendChild(view.render().ele);
          },

          addAll: function() {
              TaskModel.each(this.addOne);
          },

          renderCount: function(){
              var active = TaskModel.active().length;
              this.count.innerText = active;

              var inactive = TaskModel.done().length;
              this.clearAll.style.display = (inactive ? "block" : "none");
          },

          // dom event handlers
          create: function(){
              TaskModel.create({name: this.input.value});
              this.input.value = "";
              return false;
          },
            
          clear: function(){
              TaskModel.destroyDone();
          }
      });

    module.exports = TaskApp;
});