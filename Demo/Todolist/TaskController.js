define(function(require, exports, module) {

  var Template = require("../../sogoJS/Template");
  var Controller = require("../../sogoJS/Controller");

  var tmpl, proto;

  tmpl = Template.compile(document.getElementById("taskTemplate").innerHTML);
  proto = {
      tag: "li",
      template: tmpl,
      proxied: ["render", "remove"],
      evtArr: [{
              method:"toggle",
              eventType:"change",
              selector:"input[type=checkbox]"
          },{
              method:"destroy",
              eventType:"click",
              selector:".destroy"
          },{
              method:"edit",
              eventType:"dblclick",
              selector:".view"
          },{
              method:"blurOnEnter",
              eventType:"keypress",
              selector:"input[type=text]"
          },{
              method:"close",
              eventType:"blur",
              selector:"input[type=text]"
      }],

      eleMap: {
          "input": "input[type=text]",
          "wrapper": ".item"
      },

      init: function(item) {
          this.item = item;
          this.item.bind("update",  this.render);
          this.item.bind("destroy", this.remove);
          return this;
      },

      // model event handlers
      remove: function() {
          this.ele.parentElement.removeChild(this.ele);
      },

      render: function() {
          var htmlstr = this.template.render(this.item);
          this.ele.innerHTML = htmlstr;
          this.mapElementsToAttr();
          return this;
      },

      // dom event handlers
      toggle: function() {
          this.item.done = !this.item.done;
          this.item.save();
      },

      destroy: function() {
          this.item.destroy();
      },

      edit: function(){
          this.wrapper.className += " editing";
          this.input.focus();
      },

      blurOnEnter: function(e) {
          if(e.keyCode == 13){
              e.target.blur();
          }
      },

      close: function() {
          this.wrapper.className = this.wrapper.className.replace(" editing","");
          this.item.updateAttributes({name: this.input.value});
      }
  };
  
  var TaskController = {
      init: function(model){
          var controller = new Controller(proto);
          controller.init(model);
          return controller;
      }
  };
  
  module.exports = TaskController;
});